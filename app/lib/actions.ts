"use server";

import {
  BetterAuthErrorMessage,
  LoginSchema,
  SignUpSchema,
  ProfileSchema,
  UploadResult,
} from "@/app/lib/types";
import { parseWithZod } from "@conform-to/zod/v4";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { resend } from "@/app/lib/resend";
import { sql } from "@/app/lib/db";
import { UserLink } from "@/app/lib/types";
import { revalidatePath } from "next/cache";
import VerifyEmail from "@/app/ui/verify-email";
import { APIError } from "better-auth/api";
import { SubmissionResult } from "@conform-to/react";
import { customAlphabet, nanoid } from "nanoid";
import { imageSize } from "image-size";
import { headers } from "next/headers";
import { R2 } from "@/app/lib/r2";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

export async function profile(
  _prevState: unknown,
  formData: FormData,
): Promise<SubmissionResult<string[]> | { success: true }> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const submission = parseWithZod(formData, {
    schema: ProfileSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { image } = submission.value;
  if (!image) {
    return submission.reply({
      fieldErrors: {
        image: ["No image found."],
      },
    });
  }
  const buffer = Buffer.from(await image.arrayBuffer());
  const dimensions = imageSize(buffer);
  console.log(dimensions);

  if (dimensions.width > 1024 || dimensions.height > 1024) {
    return submission.reply({
      fieldErrors: {
        image: ["Image should be below 1024x1024px."],
      },
    });
  }

  const result = await uploadUserAvatar(image);
  if (result.success) {
    const imageId = result.imageId;
    // We will have a session for sure
    const userId = session!.user.id;
    const query = `
    UPDATE "user"
    SET image = $1
    WHERE id = $2
    RETURNING image AS old_image
  `;
    type UserImageRow = { old_image: string | null };
    const { rows } = await sql.query<UserImageRow>(query, [imageId, userId]);
    const oldImageId = rows[0]?.old_image;
    if (oldImageId) {
      await deleteUserAvatar(oldImageId);
    }
  } else {
    return submission.reply({
      fieldErrors: {
        image: ["Failed to upload image."],
      },
    });
  }

  return { success: true };
}

export async function signUp(
  _prevState: unknown,
  formData: FormData,
): Promise<
  | SubmissionResult<string[]>
  | (SubmissionResult & {
      betterAuthError: BetterAuthErrorMessage;
      isAuthError: boolean;
    })
> {
  const submission = parseWithZod(formData, { schema: SignUpSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  // On success, sign user up
  const { email, password } = submission.value;

  // Generate a unique profile code on signup
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const nanoid = customAlphabet(alphabet, 11);
  const profileCode = nanoid();

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        name: email,
        password,
        profile_code: profileCode,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      console.log(error.message, error.status);
      const authError: BetterAuthErrorMessage = {
        message: error.message || "Login failed",
        code: error.statusCode,
      };
      return {
        ...submission.reply(),
        betterAuthError: authError,
        isAuthError: true,
      };
    }

    return {
      ...submission.reply(),
      isAuthError: false,
    };
  }

  redirect("/login");
}

export async function login(
  _prevState: unknown,
  formData: FormData,
): Promise<
  | SubmissionResult<string[]>
  | (SubmissionResult & {
      betterAuthError: BetterAuthErrorMessage;
      isAuthError: boolean;
    })
> {
  const submission = parseWithZod(formData, { schema: LoginSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  // On success, login user
  const { email, password } = submission.value;

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      console.log(error.message, error.statusCode);
      const authError: BetterAuthErrorMessage = {
        message: error.message || "Login failed",
        code: error.statusCode,
      };
      return {
        ...submission.reply(),
        betterAuthError: authError,
        isAuthError: true,
      };
    }

    return {
      ...submission.reply(),
      isAuthError: false,
    };
  }

  redirect("/links");
}

/**
 * Save a user's links in bulk: insert new, update existing, delete removed
 */
export async function saveLinks(links: UserLink[]) {
  if (!links) return;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return;

  const userId = session.user.id;

  try {
    // Begin the transaction
    await sql.query("BEGIN");

    // Extract existing IDs (>0 are DB IDs)
    const existingIds = links.filter((l) => l.id > 0).map((l) => l.id);

    // Delete links that were removed
    await sql.query(
      `DELETE FROM link
       WHERE userid = $1
         AND id <> ALL($2::bigint[])`, // id <> ALL just means id isn't in existing IDs
      [userId, existingIds.length ? existingIds : [-1]], // if array empty, we set it to [-1] so SQL doesn't throw an error
    );

    // Update existing links
    const existingLinks = links.filter((l) => l.id > 0); // already in DB
    await sql.query(
      `INSERT INTO link (id, userid, website, username, position)
   SELECT * FROM UNNEST($1::bigint[], $2::text[], $3::valid_website[], $4::text[], $5::int[])
   ON CONFLICT (id) DO UPDATE
     SET website = EXCLUDED.website,
         username = EXCLUDED.username,
         position = EXCLUDED.position`,
      [
        existingLinks.map((l) => l.id),
        existingLinks.map(() => userId),
        existingLinks.map((l) => l.website),
        existingLinks.map((l) => l.username),
        existingLinks.map((l) => l.position),
      ],
    );

    // Insert new links
    const newLinks = links.filter((l) => l.id < 0);
    for (const l of newLinks) {
      await sql.query(
        `INSERT INTO link (userid, website, username, position)
         VALUES ($1, $2, $3, $4)`,
        [userId, l.website, l.username, l.position],
      );
    }

    // Commit transaction
    await sql.query("COMMIT");
  } catch (err) {
    console.error("Error saving links:", err);
    return { success: false, error: (err as Error).message };
  } finally {
    revalidatePath("/links");
    redirect("/links");
  }
}

export async function sendEmail(userId: string, email: string, url: string) {
  const domain = process.env.YOUR_DOMAIN!;

  // Creates a key that will remain the same for an hour (how long a verification URL is active for)
  //
  // 1. Date.now() → current time in ms
  // 2. Divide by (1000*60*60) → convert ms to hours since epoch
  // 3. Math.floor(...) → round down so entire hour has same number
  const key = `verify-user/${userId}-${Math.floor(Date.now() / (1000 * 60 * 60))}`;
  try {
    const { data, error } = await resend.emails.send(
      {
        from: `Dev Links <verify@${domain}>`,
        to: email,
        subject: "Verify your email",
        react: VerifyEmail({ url }),
      },
      {
        idempotencyKey: key,
      },
    );

    if (error) {
      return { error };
    }

    return { data };
  } catch (error) {
    return { error };
  }
}

export async function uploadUserAvatar(avatar: File): Promise<UploadResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { success: false, error: "Not authenticated." };

  const userId = session.user.id;
  const uniqueId = nanoid(6);
  // Since we are only going to work with jpgs and pngs
  const extension = avatar.type === "image/jpeg" ? "jpg" : "png";

  const fileName = `avatars/${userId}-${uniqueId}.${extension}`;

  const buffer = Buffer.from(await avatar.arrayBuffer());

  try {
    await R2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: fileName,
        Body: buffer,
        ContentType: avatar.type,
      }),
    );
  } catch (err) {
    console.error("R2 upload failed:", err);
    return {
      success: false,
      error: "Failed to upload avatar. Please try again.",
    };
  }

  return { success: true, imageId: fileName };
}

export async function deleteUserAvatar(key: string) {
  try {
    await R2.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: key,
      }),
    );

    console.log(`Deleted avatar: ${key}`);
    return { success: true };
  } catch (err) {
    console.error("Error deleting avatar:", err);
    return { success: false, error: err };
  }
}

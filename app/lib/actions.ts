"use server";

import {
  BetterAuthErrorMessage,
  LoginSchema,
  SignUpSchema,
} from "@/app/lib/types";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { resend } from "@/app/lib/resend";
import { sql } from "@/app/lib/db";
import { UserLink } from "@/app/lib/types";
import { revalidatePath } from "next/cache";
import VerifyEmail from "@/app/ui/verify-email";
import { APIError } from "better-auth/api";
import { SubmissionResult } from "@conform-to/react";
import { customAlphabet } from "nanoid";

export async function signUp(
  prevState: unknown,
  formData: FormData,
): Promise<SubmissionResult<string[]> | BetterAuthErrorMessage> {
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
      return {
        status: "error",
        message: error.message || "Signup failed",
        code: error.status,
      };
    }

    return {
      status: "error",
      message: "An unexpected error occurred",
    };
  }

  redirect("/login");
}

export async function login(
  prevState: unknown,
  formData: FormData,
): Promise<SubmissionResult<string[]> | BetterAuthErrorMessage> {
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
      console.log(error.message, error.status);
      return {
        status: "error",
        message: error.message || "Login failed",
        code: error.status,
      };
    }

    return {
      status: "error",
      message: "An unexpected error occurred",
    };
  }

  redirect("/home");
}

/**
 * Save a user's links in bulk: insert new, update existing, delete removed
 */
export async function saveLinks(userId: string, links: UserLink[]) {
  if (!links) return;

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

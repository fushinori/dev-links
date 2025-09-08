"use server";

import { LoginSchema, SignUpSchema } from "@/app/lib/types";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { resend } from "@/app/lib/resend";
import { sql } from "@/app/lib/db";
import { UserLink } from "@/app/lib/types";
import { revalidatePath } from "next/cache";
import VerifyEmail from "@/app/ui/verify-email";

export async function signUp(prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: SignUpSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  // On success, sign user up

  const { email, password } = submission.value;
  await auth.api.signUpEmail({
    body: {
      email: email,
      name: email,
      password: password,
    },
  });

  redirect("/login");
}

export async function login(prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: LoginSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  // On success, login user

  const { email, password } = submission.value;

  await auth.api.signInEmail({
    body: {
      email: email,
      password: password,
    },
  });

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

export async function sendEmail(email: string, url: string) {
  const domain = process.env.YOUR_DOMAIN!;
  try {
    const { data, error } = await resend.emails.send({
      from: `Dev Links <verify@${domain}>`,
      to: email,
      subject: "Verify your email",
      react: VerifyEmail({ url }),
    });

    if (error) {
      return { error };
    }

    return { data };
  } catch (error) {
    return { error };
  }
}

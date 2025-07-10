"use server";

import { LoginSchema, SignUpSchema } from "@/app/lib/types";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";

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

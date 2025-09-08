"use client";

import Link from "next/link";
import { PrimaryButton } from "@/app/ui/button/button-primary";
import Input from "@/app/ui/user-authentication/input-component";
import { signUp } from "@/app/lib/actions";
import { Suspense, useActionState, useEffect } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { BetterAuthErrorMessage, SignUpSchema } from "@/app/lib/types";
import toast from "react-hot-toast";

function SignUpForm() {
  const [lastResult, action] = useActionState(signUp, undefined);

  useEffect(() => {
    // If lastResult is from Better Auth
    if (lastResult?.status === "error" && !("error" in lastResult)) {
      const apiError = lastResult as BetterAuthErrorMessage;
      if (apiError.code === 403) {
        toast("Please verify your email first.", { icon: "🔒" });
      } else {
        toast.error(apiError.message);
      }
    }
  }, [lastResult]);

  const [form, fields] = useForm({
    // Sync the result of last submission only if the lastResult is from Conform, otherwise just send undefined
    lastResult: lastResult && "error" in lastResult ? lastResult : undefined,

    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: SignUpSchema });
    },

    // Validate for the first time when the user leaves focus
    shouldValidate: "onBlur",

    // Revalidate every time the user types
    shouldRevalidate: "onInput",
  });

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      action={action}
      className="bg-white rounded-xl flex flex-col gap-10 md:p-8"
      noValidate
    >
      <div>
        <h1 className="text-grey-700 font-bold text-[1.5rem] mb-2">
          Create account
        </h1>
        <p className="text-grey-500">
          Let’s get you started sharing your links!
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-grey-700 text-[0.75rem]">
            Email address
          </label>

          <Input
            key={fields.email.key}
            name={fields.email.name}
            defaultValue={fields.email.defaultValue}
            type="email"
            placeholder="e.g alex@email.com"
            icon="/icon-email.svg"
            errors={fields.email.errors}
            className={fields.email.errors && "border-red-400"}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-grey-700 text-[0.75rem]">
            Create password
          </label>

          <Input
            key={fields.password.key}
            name={fields.password.name}
            defaultValue={fields.password.defaultValue}
            type="password"
            placeholder="At least 8 characters"
            icon="/icon-password.svg"
            errors={fields.password.errors}
            className={fields.password.errors && "border-red-400"}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="confirm-password"
            className="text-grey-700 text-[0.75rem]"
          >
            Confirm password
          </label>

          <Input
            key={fields.confirmPassword.key}
            name={fields.confirmPassword.name}
            defaultValue={fields.confirmPassword.defaultValue}
            type="password"
            placeholder="At least 8 characters"
            icon="/icon-password.svg"
            errors={fields.confirmPassword.errors}
            className={fields.confirmPassword.errors && "border-red-400"}
          />
        </div>

        <p className="text-grey-500 text-[0.75rem]">
          Password must contain at least 8 characters
        </p>

        <PrimaryButton>Create new account</PrimaryButton>
        <p className="text-grey-500 text-center">
          Already have an account? <br className="md:hidden" />
          <Link className="text-purple-400" href="/login">
            Login
          </Link>
        </p>
      </div>
    </form>
  );
}

export default function SignUp() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}

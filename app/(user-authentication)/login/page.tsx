"use client";

import Link from "next/link";
import { PrimaryButton } from "@/app/ui/button/button-primary";
import Input from "@/app/ui/user-authentication/input-component";
import { login } from "@/app/lib/actions";
import { LoginSchema } from "@/app/lib/types";

import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { useForm } from "@conform-to/react";

export default function LoginForm() {
  const [lastResult, action] = useActionState(login, undefined);

  const [form, fields] = useForm({
    // Sync the result of last submission
    lastResult,

    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginSchema });
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
        <h1 className="text-grey-700 font-bold text-[1.5rem] mb-2">Login</h1>
        <p className="text-grey-500">
          Add your details to get back into the app.
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
            Password
          </label>

          <Input
            key={fields.password.key}
            name={fields.password.name}
            defaultValue={fields.password.defaultValue}
            type="password"
            placeholder="Enter your password"
            icon="/icon-password.svg"
            errors={fields.password.errors}
            className={fields.password.errors && "border-red-400"}
          />
        </div>

        <PrimaryButton>Login</PrimaryButton>

        <div className="flex flex-col"></div>
        <p className="text-grey-500 text-center">
          Don&apos;t have an account? <br className="md:hidden" />
          <Link className="text-purple-400" href="/signup">
            Create account
          </Link>
        </p>
      </div>
    </form>
  );
}

"use client";
import { useActionState } from "react";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { ProfileSchema } from "@/app/lib/types";
import { profile } from "@/app/lib/actions";
import Input from "@/app/ui/user-authentication/input-component";
import ProfilePictureSelector from "@/app/ui/profile-picture-selector";
import { PrimaryButton } from "@/app/ui/button/button-primary";

export default function ProfileForm() {
  const [lastResult, action] = useActionState(profile, undefined);

  const [form, fields] = useForm({
    // Sync the result of last submission if not success
    lastResult:
      lastResult && !("success" in lastResult) ? lastResult : undefined,
    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: ProfileSchema,
      });
    },

    // Validate for the first time when the user leaves focus
    shouldValidate: "onBlur",

    // Revalidate every time the user types
    shouldRevalidate: "onInput",
  });

  console.log(fields);

  return (
    <form {...getFormProps(form)} action={action} noValidate>
      <ProfilePictureSelector
        {...getInputProps(fields.image, { type: "file" })}
        error={fields.image.errors}
      />

      <div className="w-full bg-grey-100 rounded-xl p-5 flex flex-col gap-3 my-6">
        <InputElement
          label="First name*"
          {...getInputProps(fields.firstName, { type: "text" })}
          placeholder="John"
          errors={fields.firstName.errors}
        />
        <InputElement
          label="Last name"
          {...getInputProps(fields.lastName, { type: "text" })}
          placeholder="Doe"
          errors={fields.lastName.errors}
        />
        <InputElement
          label="Email address"
          {...getInputProps(fields.email, { type: "email" })}
          placeholder="e.g alex@email.com"
          errors={fields.email.errors}
        />
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-grey-300 border-t-[1px]">
        <PrimaryButton className="w-full" type="submit">
          Save
        </PrimaryButton>
      </div>
    </form>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errors?: string[];
}

function InputElement({ label, errors, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={props.id} className="text-grey-700 text-[0.75rem]">
        {label}
      </label>

      <Input className="pl-4 bg-white" {...props} />

      {errors && <p className="text-sm text-red-400">{errors[0]}</p>}
    </div>
  );
}

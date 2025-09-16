"use client";

import { ChangeEvent, useActionState, useState } from "react";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { useFormData, isDirty } from "@conform-to/react/future";
import { ProfileSchema, User } from "@/app/lib/types";
import { profile } from "@/app/lib/actions";
import Input from "@/app/ui/user-authentication/input-component";
import ProfilePictureSelector from "@/app/ui/profile-picture-selector";
import { PrimaryButton } from "@/app/ui/button/button-primary";

interface Props {
  user: User;
}

export default function ProfileForm({ user }: Props) {
  const [lastResult, action] = useActionState(profile, undefined);
  const [imageDirty, setImageDirty] = useState(false);

  const defaultValue = {
    firstName: user.first_name ?? "",
    lastName: user.last_name ?? "",
    email: user.email,
    image: undefined,
  };

  const [form, fields] = useForm({
    // Sync the result of last submission if not success
    lastResult,

    // Pass default values to check if form is dirty
    defaultValue,

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

  // Check whether the text inputs are dirty
  const inputDirty = useFormData(
    form.id,
    (formData) =>
      isDirty(formData, {
        defaultValue,
        // Skip server action hidden inputs and image
        skipEntry: (name) => name.startsWith("$ACTION") || name === "image",
      }) ?? false,
  );

  // Check if image input is dirty and update state accordingly
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    // If value is "", then no image
    const isImage = e.target.value.length === 0;
    setImageDirty(!isImage);
  }

  const dirty = inputDirty || imageDirty;

  return (
    <form {...getFormProps(form)} action={action} noValidate>
      <ProfilePictureSelector
        {...getInputProps(fields.image, { type: "file" })}
        error={fields.image.errors}
        onChange={handleChange} // Pass in event handler to check if valid image has been selected
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
          readOnly={true}
        />
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-grey-300 border-t-[1px]">
        <PrimaryButton
          className="w-full disabled:bg-grey-300 disabled:shadow-none disabled:cursor-default"
          type="submit"
          // Disable button if form is not dirty
          disabled={!dirty}
        >
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

      <Input
        className="pl-4 bg-white read-only:bg-gray-100 read-only:text-gray-500"
        {...props}
      />

      {errors && <p className="text-sm text-red-400">{errors[0]}</p>}
    </div>
  );
}

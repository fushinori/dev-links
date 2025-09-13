"use client";

import { useState } from "react";
import { cn } from "@/app/lib/utils";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string[];
}

export default function ProfilePictureSelector({ error, ...props }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const showPreview = preview && !error;

  return (
    <div className="w-full bg-grey-100 rounded-xl p-5 flex flex-col gap-4 my-10">
      <p className="text-grey-500">Profile picture</p>
      <label
        htmlFor={props.id}
        className="relative overflow-hidden rounded-xl bg-purple-200 flex flex-col gap-3 w-2/3 min-w-50 items-center justify-center py-14 px-10 cursor-pointer"
        style={
          showPreview
            ? {
                backgroundImage: `url(${preview})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      >
        {/* Overlay only if preview exists */}
        {showPreview && <div className="absolute inset-0 bg-black/40" />}

        <div className="relative z-10 flex flex-col items-center gap-3">
          {/* Icon styled with mask-image so we can recolor */}
          <div
            className={cn(
              "w-[35px] h-[35px]",
              showPreview ? "bg-white" : "bg-purple-400",
            )}
            style={{
              WebkitMaskImage: "url(/icon-upload-image.svg)",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              WebkitMaskSize: "contain",
              maskImage: "url(/icon-upload-image.svg)",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              maskSize: "contain",
            }}
          />

          <p
            className={cn(
              "font-semibold",
              showPreview ? "text-white" : "text-purple-400",
            )}
          >
            {showPreview ? "Change Image" : "+ Upload Image"}
          </p>
        </div>
      </label>
      {error && <p className="text-sm text-red-600">{error[0]}</p>}
      <p className="text-grey-500 text-xs">
        Image must be below 1024x1024px. Use PNG or JPG format.
      </p>

      <input
        type="file"
        className="sr-only"
        accept="image/*"
        onChange={handleFileChange}
        {...props}
      />
    </div>
  );
}

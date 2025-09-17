"use client";

import Link from "next/link";
import { PrimaryButton } from "@/app/ui/button/button-primary";
import toast from "react-hot-toast";

export default function LinkNav() {
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("The link has been copied to your clipboard!", { icon: "🔗" });
    } catch {
      toast.error("Failed to copy the link. Please copy the link manually.");
    }
  };

  return (
    <nav className="flex justify-between p-4">
      <Link
        href="/links"
        className="flex justify-center rounded-lg px-6 py-3 text-purple-400 font-semibold border-purple-400 border cursor-pointer"
      >
        Back to Editor
      </Link>
      <PrimaryButton onClick={handleClick}>Share Link</PrimaryButton>
    </nav>
  );
}

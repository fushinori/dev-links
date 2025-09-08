"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function VerifyToast() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      toast.success("Email successfully verified!");
      // Remove the query param so the toast doesn’t show again on refresh
      router.replace("/links");
    }
  }, [searchParams, router]);

  return null;
}

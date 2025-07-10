"use client";

import { redirect } from "next/navigation";
import { authClient } from "../lib/auth-client";

export default function LogOutButton() {
  const handleClick = async () => {
    await authClient.signOut();
    redirect("login");
  };

  return (
    <button onClick={handleClick} className="border-purple-400 border-[1px]">
      Logout
    </button>
  );
}

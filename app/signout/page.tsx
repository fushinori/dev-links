import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignOut() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  } else {
    await auth.api.signOut({
      headers: await headers(),
    });
    redirect("/login");
  }
}

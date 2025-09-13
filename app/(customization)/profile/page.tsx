import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import ProfileForm from "@/app/ui/profile-form";

export default async function Profile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    // We redirect with a query param
    redirect("/login?from=profile");
  }

  return (
    <main className="p-4 bg-grey-100">
      <div className="bg-white p-6 rounded-sm">
        <h1 className="font-bold text-2xl text-grey-700 mb-2">
          Profile Details
        </h1>
        <p className="text-grey-500 mb-10">
          Add your details to create a personal touch to your profile.
        </p>
        <ProfileForm />
      </div>
    </main>
  );
}

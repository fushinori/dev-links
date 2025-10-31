import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import ProfileForm from "@/app/ui/profile-form";
import { Session } from "better-auth";
import { sql } from "@/app/lib/db";
import { User } from "@/app/lib/types";
import { Suspense } from "react";

export default async function Profile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    // We redirect with a query param
    redirect("/login?from=profile");
  }

  return (
    <main className="p-4 md:p-6 bg-grey-100">
      <div className="bg-white p-6 md:p-10 rounded-sm md:rounded-xl">
        <h1 className="font-bold text-2xl md:text-3xl text-grey-700 mb-2">
          Profile Details
        </h1>
        <p className="text-grey-500 mb-10">
          Add your details to create a personal touch to your profile.
        </p>
        <Suspense>
          <ProfileFormWrapper session={session.session} />
        </Suspense>
      </div>
    </main>
  );
}

interface Props {
  session: Session;
}

async function ProfileFormWrapper({ session }: Props) {
  const userId = session.userId;
  const { rows } = await sql.query<User>(
    `SELECT first_name, last_name, email, show_email FROM "user" WHERE id = $1`,
    [userId],
  );

  const user = rows[0];

  if (!user) return;

  return <ProfileForm user={user} />;
}

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import LinksForm from "@/app/ui/links-form";
import VerifyToast from "@/app/ui/verify-toast";
import { sql } from "@/app/lib/db";
import { UserLink } from "@/app/lib/types";
import { Suspense } from "react";
import { Session } from "better-auth";
import LinksFormSkeleton from "@/app/ui/skeletons/links-form-skeleton";

export default async function Links() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    // We redirect with a query param
    redirect("/login?from=links");
  }

  return (
    <main className="p-4 bg-grey-100">
      {/* Toast component */}
      <VerifyToast />

      <div className="bg-white p-6 rounded-sm">
        <h1 className="font-bold text-2xl text-grey-700 mb-2">
          Customize your links
        </h1>
        <p className="text-grey-500 mb-10">
          Add/edit/remove links below and then share all your profiles with the
          world!
        </p>
        <Suspense fallback=<LinksFormSkeleton />>
          <LinksFormWrapper session={session.session} />
        </Suspense>
      </div>
    </main>
  );
}

interface Props {
  session: Session;
}

async function LinksFormWrapper({ session }: Props) {
  const userId = session.userId;
  const { rows } = await sql.query<UserLink>(
    "SELECT id, position, website, username FROM link WHERE userid = $1 ORDER BY position ASC",
    [userId],
  );

  return <LinksForm initialLinks={rows} />;
}

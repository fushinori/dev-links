import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import LinksForm from "@/app/ui/links-form";

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
      <div className="bg-white p-6 rounded-sm">
        <h1 className="font-bold text-2xl text-grey-700 mb-2">
          Customize your links
        </h1>
        <p className="text-grey-500 mb-10">
          Add/edit/remove links below and then share all your profiles with the
          world!
        </p>
        <LinksForm />
      </div>
    </main>
  );
}

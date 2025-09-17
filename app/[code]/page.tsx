import { sql } from "@/app/lib/db";
import { notFound } from "next/navigation";
import { UserInfo, UserLink } from "@/app/lib/types";
import Image from "next/image";
import { headers } from "next/headers";
import Link from "@/app/ui/link";
import { auth } from "@/app/lib/auth";
import LinkNav from "@/app/ui/link-nav";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const { rows } = await sql.query<UserInfo>(
    `SELECT CONCAT_WS(' ', first_name, last_name) AS full_name, email, image, id FROM "user" WHERE profile_code = $1`,
    [code],
  );
  const user = rows[0];
  if (!user) {
    return notFound();
  }

  const { id, full_name, email, image } = user;
  const name = full_name || "User 404";
  const avatar = image
    ? `${process.env.IMAGE_DOMAIN}/${image}`
    : `${process.env.IMAGE_DOMAIN}/avatars/default.png`;

  // Check whether user can edit links
  let canEdit: boolean;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    canEdit = false;
  } else {
    canEdit = session.user.id === id;
  }

  return (
    <>
      {canEdit && <LinkNav />}
      <main className="m-16">
        <section className="flex flex-col justify-center items-center mb-14">
          <div className="relative w-28 h-28 rounded-full border-purple-400 border-[3px] overflow-hidden mb-5">
            <Image
              src={avatar}
              alt={`Avatar of ${name}`}
              fill
              className="object-cover block"
            />
          </div>
          <h1 className="text-grey-700 font-bold text-3xl mb-1">{name}</h1>
          <p className="text-grey-500 ">{email}</p>
        </section>

        <Suspense>
          <Links profileCode={code} />
        </Suspense>
      </main>
    </>
  );
}

interface LinkProps {
  profileCode: string;
}

async function Links({ profileCode }: LinkProps) {
  const { rows } = await sql.query<UserLink>(
    `SELECT link.id, website, username, position
    FROM link
    JOIN "user" ON link.userid = "user".id
    WHERE profile_code = $1
    ORDER BY position;`,
    [profileCode],
  );

  return (
    <section aria-label="Links" className="flex flex-col gap-5 text-white">
      {rows.map((link) => (
        <Link key={link.id} link={link} />
      ))}
    </section>
  );
}

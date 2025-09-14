import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";

// GET /api/links
export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { rows } = await sql.query(
    "SELECT id, position, website, username FROM link WHERE userid = $1 ORDER BY position ASC",
    [userId],
  );

  return NextResponse.json(rows);
}

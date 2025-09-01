import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db";

// GET /api/links
export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userid");

  if (!userId) {
    return NextResponse.json({ error: "Missing userid" }, { status: 400 });
  }

  const { rows } = await sql.query(
    "SELECT id, position, website, username FROM link WHERE userid = $1 ORDER BY position ASC",
    [userId],
  );

  return NextResponse.json(rows);
}

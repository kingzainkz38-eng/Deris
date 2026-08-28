import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";
import type { PublicUser } from "@/lib/types";

export async function GET() {
  const uid = await getCurrentUserId();
  if (!uid) return NextResponse.json({ user: null });

  const rows = await query<PublicUser>(
    `SELECT id, name, email, phone, city, bio, avatar_key, created_at FROM users WHERE id = $1`,
    [uid]
  );
  return NextResponse.json({ user: rows[0] || null });
}

export async function PUT(req: NextRequest) {
  const uid = await getCurrentUserId();
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  const name = String(body.name || "").trim();
  const phone = body.phone ? String(body.phone).trim() : null;
  const city = body.city ? String(body.city).trim() : null;
  const bio = body.bio ? String(body.bio).trim() : null;
  const avatarKey: string | null | undefined =
    body.avatarKey !== undefined ? (body.avatarKey ? String(body.avatarKey) : null) : undefined;

  if (!name) return NextResponse.json({ error: "invalid_fields" }, { status: 400 });

  if (avatarKey === undefined) {
    await query(`UPDATE users SET name = $1, phone = $2, city = $3, bio = $4 WHERE id = $5`, [
      name,
      phone,
      city,
      bio,
      uid,
    ]);
  } else {
    await query(`UPDATE users SET name = $1, phone = $2, city = $3, bio = $4, avatar_key = $5 WHERE id = $6`, [
      name,
      phone,
      city,
      bio,
      avatarKey,
      uid,
    ]);
  }

  const rows = await query<PublicUser>(
    `SELECT id, name, email, phone, city, bio, avatar_key, created_at FROM users WHERE id = $1`,
    [uid]
  );
  return NextResponse.json({ user: rows[0] });
}

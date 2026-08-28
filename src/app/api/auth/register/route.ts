import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const phone = body.phone ? String(body.phone).trim() : null;
  const city = body.city ? String(body.city).trim() : null;

  if (!name || !email || !email.includes("@") || password.length < 6) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  const existing = await query<{ id: number }>(`SELECT id FROM users WHERE email = $1`, [email]);
  if (existing.length > 0) {
    return NextResponse.json({ error: "email_taken" }, { status: 409 });
  }

  const hash = await hashPassword(password);
  const rows = await query(
    `INSERT INTO users (name, email, password_hash, phone, city)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, city, bio, created_at`,
    [name, email, hash, phone, city]
  );

  const user = rows[0] as { id: number };
  await setSessionCookie(user.id);
  return NextResponse.json({ user });
}

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  const rows = await query<{
    id: number;
    name: string;
    email: string;
    phone: string | null;
    city: string | null;
    bio: string | null;
    password_hash: string;
    created_at: string;
  }>(
    `SELECT id, name, email, phone, city, bio, password_hash, created_at FROM users WHERE email = $1`,
    [email]
  );
  const user = rows[0];
  if (!user) return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });

  await setSessionCookie(user.id);
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      bio: user.bio,
      created_at: user.created_at,
    },
  });
}

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const uid = await getCurrentUserId();
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const providerId = Number(id);
  if (providerId === uid) {
    return NextResponse.json({ error: "cannot_review_self" }, { status: 400 });
  }

  const provider = await query<{ id: number }>(`SELECT id FROM users WHERE id = $1`, [providerId]);
  if (!provider[0]) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  const rating = Number(body.rating);
  const comment = body.comment ? String(body.comment).trim() : null;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "invalid_rating" }, { status: 400 });
  }

  const rows = await query<{ id: number; created_at: string }>(
    `INSERT INTO reviews (provider_id, reviewer_id, rating, comment)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (provider_id, reviewer_id)
     DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, created_at = NOW()
     RETURNING id, created_at`,
    [providerId, uid, rating, comment]
  );

  return NextResponse.json({ id: rows[0].id, created_at: rows[0].created_at }, { status: 201 });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const uid = await getCurrentUserId();
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  await query(`DELETE FROM reviews WHERE provider_id = $1 AND reviewer_id = $2`, [Number(id), uid]);
  return NextResponse.json({ ok: true });
}

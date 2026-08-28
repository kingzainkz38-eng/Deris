import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";
import type { PostSummary } from "@/lib/types";

const POST_SELECT = `
  SELECT p.id, p.content, p.image_key, p.created_at, p.listing_id,
         u.id as user_id, u.name as user_name,
         l.title as listing_title,
         COUNT(DISTINCT pl.user_id)::int as like_count,
         COUNT(DISTINCT pc.id)::int as comment_count,
         COALESCE(bool_or(pl.user_id = $1), false) as liked_by_me
  FROM posts p
  JOIN users u ON u.id = p.user_id
  LEFT JOIN listings l ON l.id = p.listing_id
  LEFT JOIN post_likes pl ON pl.post_id = p.id
  LEFT JOIN post_comments pc ON pc.post_id = p.id
  GROUP BY p.id, u.id, l.id
  ORDER BY p.created_at DESC
  LIMIT $2 OFFSET $3
`;

export async function GET(req: NextRequest) {
  const uid = await getCurrentUserId();
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 15, 1), 50);
  const offset = Math.max(Number(searchParams.get("offset")) || 0, 0);

  const posts = await query<PostSummary>(POST_SELECT, [uid ?? 0, limit, offset]);
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const uid = await getCurrentUserId();
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  const content = String(body.content || "").trim();
  const imageKey = body.imageKey ? String(body.imageKey) : null;
  const listingId = body.listingId ? Number(body.listingId) : null;

  if (!content && !imageKey) {
    return NextResponse.json({ error: "empty_post" }, { status: 400 });
  }
  if (content.length > 2000) {
    return NextResponse.json({ error: "too_long" }, { status: 400 });
  }

  if (listingId) {
    const owned = await query<{ id: number }>(
      `SELECT id FROM listings WHERE id = $1 AND user_id = $2`,
      [listingId, uid]
    );
    if (!owned[0]) return NextResponse.json({ error: "invalid_listing" }, { status: 400 });
  }

  const rows = await query<{ id: number }>(
    `INSERT INTO posts (user_id, content, image_key, listing_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [uid, content, imageKey, listingId]
  );

  return NextResponse.json({ id: rows[0].id }, { status: 201 });
}

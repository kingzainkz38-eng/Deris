import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const uid = await getCurrentUserId();
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const postId = Number(id);
  const existing = await query<{ id: number }>(`SELECT id FROM posts WHERE id = $1`, [postId]);
  if (!existing[0]) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const liked = await query<{ user_id: number }>(
    `SELECT user_id FROM post_likes WHERE post_id = $1 AND user_id = $2`,
    [postId, uid]
  );

  if (liked[0]) {
    await query(`DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2`, [postId, uid]);
  } else {
    await query(`INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)`, [postId, uid]);
  }

  const [{ count }] = await query<{ count: number }>(
    `SELECT COUNT(*)::int as count FROM post_likes WHERE post_id = $1`,
    [postId]
  );

  return NextResponse.json({ liked: !liked[0], likeCount: count });
}

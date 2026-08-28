import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";
import type { PostComment } from "@/lib/types";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const comments = await query<PostComment>(
    `SELECT c.id, c.post_id, c.content, c.created_at, u.id as user_id, u.name as user_name
     FROM post_comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.post_id = $1
     ORDER BY c.created_at ASC`,
    [Number(id)]
  );
  return NextResponse.json({ comments });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const uid = await getCurrentUserId();
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const postId = Number(id);
  const existing = await query<{ id: number }>(`SELECT id FROM posts WHERE id = $1`, [postId]);
  if (!existing[0]) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const content = String(body?.content || "").trim();
  if (!content) return NextResponse.json({ error: "empty_comment" }, { status: 400 });
  if (content.length > 1000) return NextResponse.json({ error: "too_long" }, { status: 400 });

  const rows = await query<{ id: number; created_at: string }>(
    `INSERT INTO post_comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id, created_at`,
    [postId, uid, content]
  );

  return NextResponse.json(
    {
      comment: {
        id: rows[0].id,
        post_id: postId,
        content,
        created_at: rows[0].created_at,
        user_id: uid,
      },
    },
    { status: 201 }
  );
}

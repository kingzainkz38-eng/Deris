import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";
import type { PortfolioItem } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams.get("userId"));
  if (!userId) return NextResponse.json({ error: "missing_user_id" }, { status: 400 });

  const items = await query<PortfolioItem>(
    `SELECT id, user_id, title, description, image_key, created_at
     FROM portfolio_items WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const uid = await getCurrentUserId();
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  const title = String(body.title || "").trim();
  const description = body.description ? String(body.description).trim() : null;
  const imageKey = body.imageKey ? String(body.imageKey) : null;

  if (!title) return NextResponse.json({ error: "invalid_fields" }, { status: 400 });

  const rows = await query<{ id: number }>(
    `INSERT INTO portfolio_items (user_id, title, description, image_key)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [uid, title, description, imageKey]
  );

  return NextResponse.json({ id: rows[0].id }, { status: 201 });
}

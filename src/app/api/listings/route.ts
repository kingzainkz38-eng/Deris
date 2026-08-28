import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";
import type { ListingSummary } from "@/lib/types";

const LISTING_SELECT = `
  SELECT l.id, l.title, l.description, l.price, l.price_type, l.city, l.image_key, l.status, l.created_at,
         u.id as user_id, u.name as user_name,
         c.slug as category_slug, c.name_en as category_name_en, c.name_so as category_name_so, c.icon as category_icon
  FROM listings l
  JOIN users u ON u.id = l.user_id
  JOIN categories c ON c.id = l.category_id
`;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  const category = searchParams.get("category")?.trim() || "";
  const city = searchParams.get("city")?.trim() || "";
  const userId = searchParams.get("userId");
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 24, 1), 60);

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (userId) {
    params.push(Number(userId));
    conditions.push(`l.user_id = $${params.length}`);
  } else {
    conditions.push(`l.status = 'active'`);
  }

  if (q) {
    params.push(`%${q}%`);
    conditions.push(`(l.title ILIKE $${params.length} OR l.description ILIKE $${params.length})`);
  }

  if (category) {
    params.push(category);
    conditions.push(`c.slug = $${params.length}`);
  }

  if (city) {
    params.push(`%${city}%`);
    conditions.push(`l.city ILIKE $${params.length}`);
  }

  params.push(limit);
  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const listings = await query<ListingSummary>(
    `${LISTING_SELECT} ${whereClause} ORDER BY l.created_at DESC LIMIT $${params.length}`,
    params
  );

  return NextResponse.json({ listings });
}

export async function POST(req: NextRequest) {
  const uid = await getCurrentUserId();
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  const categorySlug = String(body.category || "").trim();
  const priceType = ["fixed", "hourly", "negotiable"].includes(body.priceType) ? body.priceType : "fixed";
  const price = priceType === "negotiable" ? null : Number(body.price) || null;
  const city = body.city ? String(body.city).trim() : null;
  const imageKey = body.imageKey ? String(body.imageKey) : null;

  if (!title || !description || !categorySlug) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  const catRows = await query<{ id: number }>(`SELECT id FROM categories WHERE slug = $1`, [categorySlug]);
  if (!catRows[0]) return NextResponse.json({ error: "invalid_category" }, { status: 400 });

  const rows = await query<{ id: number }>(
    `INSERT INTO listings (user_id, category_id, title, description, price, price_type, city, image_key)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id`,
    [uid, catRows[0].id, title, description, price, priceType, city, imageKey]
  );

  return NextResponse.json({ id: rows[0].id }, { status: 201 });
}

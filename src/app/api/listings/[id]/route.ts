import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";
import type { ListingDetail } from "@/lib/types";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await query<ListingDetail>(
    `SELECT l.id, l.title, l.description, l.price, l.price_type, l.city, l.image_key, l.status, l.created_at,
            u.id as user_id, u.name as user_name, u.phone as user_phone, u.city as user_city, u.created_at as user_created_at,
            c.slug as category_slug, c.name_en as category_name_en, c.name_so as category_name_so, c.icon as category_icon
     FROM listings l
     JOIN users u ON u.id = l.user_id
     JOIN categories c ON c.id = l.category_id
     WHERE l.id = $1`,
    [Number(id)]
  );
  const listing = rows[0];
  if (!listing) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ listing });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const uid = await getCurrentUserId();
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const existing = await query<{ user_id: number }>(`SELECT user_id FROM listings WHERE id = $1`, [Number(id)]);
  if (!existing[0]) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (existing[0].user_id !== uid) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  const categorySlug = String(body.category || "").trim();
  const priceType = ["fixed", "hourly", "negotiable"].includes(body.priceType) ? body.priceType : "fixed";
  const price = priceType === "negotiable" ? null : Number(body.price) || null;
  const city = body.city ? String(body.city).trim() : null;
  const status = ["active", "paused"].includes(body.status) ? body.status : "active";
  const imageKey: string | null | undefined =
    body.imageKey !== undefined ? (body.imageKey ? String(body.imageKey) : null) : undefined;

  if (!title || !description || !categorySlug) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  const catRows = await query<{ id: number }>(`SELECT id FROM categories WHERE slug = $1`, [categorySlug]);
  if (!catRows[0]) return NextResponse.json({ error: "invalid_category" }, { status: 400 });

  if (imageKey === undefined) {
    await query(
      `UPDATE listings SET title=$1, description=$2, category_id=$3, price=$4, price_type=$5, city=$6, status=$7, updated_at=NOW() WHERE id=$8`,
      [title, description, catRows[0].id, price, priceType, city, status, Number(id)]
    );
  } else {
    await query(
      `UPDATE listings SET title=$1, description=$2, category_id=$3, price=$4, price_type=$5, city=$6, status=$7, image_key=$8, updated_at=NOW() WHERE id=$9`,
      [title, description, catRows[0].id, price, priceType, city, status, imageKey, Number(id)]
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const uid = await getCurrentUserId();
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const existing = await query<{ user_id: number }>(`SELECT user_id FROM listings WHERE id = $1`, [Number(id)]);
  if (!existing[0]) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (existing[0].user_id !== uid) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  await query(`DELETE FROM listings WHERE id = $1`, [Number(id)]);
  return NextResponse.json({ ok: true });
}

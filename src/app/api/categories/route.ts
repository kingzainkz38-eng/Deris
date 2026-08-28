import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { Category } from "@/lib/types";

export async function GET() {
  const categories = await query<Category>(
    `SELECT id, slug, name_en, name_so, icon FROM categories ORDER BY name_en`
  );
  return NextResponse.json({ categories });
}

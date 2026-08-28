import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const uid = await getCurrentUserId();
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const existing = await query<{ user_id: number }>(`SELECT user_id FROM portfolio_items WHERE id = $1`, [
    Number(id),
  ]);
  if (!existing[0]) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (existing[0].user_id !== uid) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  await query(`DELETE FROM portfolio_items WHERE id = $1`, [Number(id)]);
  return NextResponse.json({ ok: true });
}

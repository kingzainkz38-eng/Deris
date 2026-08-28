import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getCurrentUserId } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const uid = await getCurrentUserId();
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "invalid_type" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "too_large" }, { status: 400 });
  }

  const ext = (file.type.split("/")[1] || "jpg").replace("jpeg", "jpg");
  const filename = `${uid}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;

  // BLOB_READ_WRITE_TOKEN is the classic static-token auth path. Newer Blob
  // store connections instead rely on Vercel's OIDC federation (no static
  // token env var at all), which @vercel/blob's `put()` picks up on its own
  // as long as BLOB_STORE_ID is present — so check for either.
  if (process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`listings/${filename}`, file, {
      access: "public",
      contentType: file.type,
    });
    return NextResponse.json({ key: blob.url });
  }

  // No Vercel Blob store connected (e.g. local dev) — save to disk under
  // public/uploads and serve it back via Next's static file handling.
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), bytes);

  return NextResponse.json({ key: `/uploads/${filename}` });
}

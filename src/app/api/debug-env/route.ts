import { NextRequest, NextResponse } from "next/server";

// Temporary diagnostic endpoint to confirm which env vars are actually
// present at runtime, without leaking their values. Remove once the
// Blob-storage env var issue is resolved.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("key") !== "2024ed5614f4972b7ef9cbff03344db5fee0f41382d091aa") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const relevantKeys = Object.keys(process.env).filter(
    (k) => k.includes("BLOB") || k.includes("DATABASE") || k.includes("POSTGRES")
  );

  return NextResponse.json({
    hasBlobToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    relevantEnvKeys: relevantKeys,
    vercelEnv: process.env.VERCEL_ENV || null,
  });
}

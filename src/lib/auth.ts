import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const COOKIE_NAME = "deris_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

// Falls back to a baked-in secret when SESSION_SECRET isn't set as an
// environment variable (e.g. before it's added in the hosting dashboard).
// Prefer setting SESSION_SECRET in the deployment's environment variables
// for production use.
const FALLBACK_SECRET = "e472632150c9383228f8b0429663e11e33a2e6862d7821a3c10fec55fbb20295";

function getSecret(): string {
  return process.env.SESSION_SECRET || FALLBACK_SECRET;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(userId: number): string {
  const payload = JSON.stringify({ uid: userId, exp: Date.now() + MAX_AGE_SECONDS * 1000 });
  const b64 = Buffer.from(payload).toString("base64url");
  const sig = sign(b64);
  return `${b64}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): number | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [b64, sig] = parts;
  const expected = sign(b64);
  if (sig.length !== expected.length) return null;
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;
  try {
    const payload = JSON.parse(Buffer.from(b64, "base64url").toString());
    if (typeof payload.uid !== "number" || typeof payload.exp !== "number") return null;
    if (payload.exp < Date.now()) return null;
    return payload.uid;
  } catch {
    return null;
  }
}

export async function getCurrentUserId(): Promise<number | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function setSessionCookie(userId: number): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, createSessionToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

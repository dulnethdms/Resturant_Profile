import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, adminToken, isValidToken, passwordMatches } from "@/lib/auth";

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 8;

function clientIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const now = Date.now();
  const entry = attempts.get(ip);

  if (entry && entry.resetAt > now && entry.count >= MAX_ATTEMPTS) {
    return NextResponse.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  }

  const body = (await request.json().catch(() => ({}))) as { password?: unknown };

  if (!passwordMatches(body.password)) {
    attempts.set(ip, {
      count: entry && entry.resetAt > now ? entry.count + 1 : 1,
      resetAt: now + WINDOW_MS,
    });
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  attempts.delete(ip);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: new URL(request.url).protocol === "https:",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}

export async function GET(request: NextRequest) {
  // Support accidentally hitting the login route with GET.
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  return NextResponse.json({ authed: isValidToken(token) });
}

import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  return NextResponse.json({ authed: isValidToken(token) });
}

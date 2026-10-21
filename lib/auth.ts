import { createHash, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "nocturne_admin_session";

export function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? "admin123";
}

/** Deterministic session token derived from the password (prototype-grade barrier). */
export function adminToken(): string {
  return createHash("sha256").update(`nocturne-admin::${adminPassword()}`).digest("hex");
}

export function isValidToken(candidate: string | null | undefined): boolean {
  if (!candidate) return false;
  const expected = Buffer.from(adminToken(), "hex");
  const received = Buffer.from(candidate, "hex");
  if (received.length !== expected.length) return false;
  return timingSafeEqual(received, expected);
}

export function passwordMatches(attempt: unknown): boolean {
  if (typeof attempt !== "string") return false;
  const a = createHash("sha256").update(attempt).digest();
  const b = createHash("sha256").update(adminPassword()).digest();
  return timingSafeEqual(a, b);
}

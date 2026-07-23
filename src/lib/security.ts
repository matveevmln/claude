import crypto from "node:crypto";
import { site } from "@/config/site";

/** Origin/Referer check — the standard CSRF defense for same-site cookie auth without a token. */
export function isTrustedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin") ?? request.headers.get("referer");
  if (!origin) return false;

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  const requestHost = request.headers.get("host") ?? "";
  let siteHost = "";
  try {
    siteHost = new URL(site.domain).host;
  } catch {
    // ignore
  }

  return originHost === requestHost || originHost === siteHost;
}

/** Constant-time string comparison for secrets/signatures — avoids timing side-channels. */
export function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still do a comparison of equal length to avoid leaking length via timing.
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

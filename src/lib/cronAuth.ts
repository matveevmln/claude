import { timingSafeStringEqual } from "@/lib/security";

/**
 * Shared-secret auth for scheduled jobs (Vercel Cron, system crontab, etc).
 * Expects `Authorization: Bearer <CRON_SECRET>`. Fails closed in production
 * if the secret isn't configured — same pattern as the payment/Telegram
 * webhooks, so an unconfigured deployment can't be triggered by anyone who
 * finds the URL.
 */
export function isAuthorizedCronRequest(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }
  const header = request.headers.get("authorization") ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice(7) : "";
  return timingSafeStringEqual(provided, secret);
}

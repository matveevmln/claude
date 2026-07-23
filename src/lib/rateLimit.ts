/**
 * In-memory sliding-window rate limiter. Sufficient for a single-instance
 * deployment; if you scale to multiple instances/serverless, swap this for
 * a shared store (Upstash Redis is the common choice — same interface,
 * `limit(key)` returning `{ allowed, remaining }`).
 */
const buckets = new Map<string, number[]>();

// Periodic cleanup so this never grows unbounded on a long-running process.
setInterval(() => {
  const now = Date.now();
  for (const [key, hits] of buckets) {
    const fresh = hits.filter((t) => now - t < 15 * 60 * 1000);
    if (fresh.length === 0) buckets.delete(key);
    else buckets.set(key, fresh);
  }
}, 5 * 60 * 1000).unref?.();

export function rateLimit(key: string, { windowMs, max }: { windowMs: number; max: number }): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  hits.push(now);
  buckets.set(key, hits);
  return hits.length <= max;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

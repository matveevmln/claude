import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Liveness/readiness probe for Docker healthcheck, load balancers, and
 * uptime monitors. Checks real DB connectivity rather than just "the
 * process is up" — a Next.js server can respond to HTTP while its DB
 * connection pool is exhausted or the database is unreachable.
 */
export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", db: "up", timestamp: new Date().toISOString() });
  } catch (err) {
    console.error("[health] DB check failed", err);
    return NextResponse.json(
      { status: "error", db: "down", timestamp: new Date().toISOString() },
      { status: 503 }
    );
  }
}

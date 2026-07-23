import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getLesson, saveLessonPosition } from "@/lib/lms";
import { getEffectiveUserId } from "@/lib/impersonation";
import { isTrustedOrigin } from "@/lib/security";
import { rateLimit } from "@/lib/rateLimit";

const schema = z.object({ positionSec: z.number().int().min(0).max(60 * 60 * 6) });

/** Lightweight heartbeat from the video player — powers "continue watching". */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/account/lessons/[lessonId]/position">) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  if (!rateLimit(`lesson-position:${session.user.id}`, { windowMs: 60_000, max: 30 })) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { lessonId } = await ctx.params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const { userId } = await getEffectiveUserId(session);
  const access = await getLesson(lessonId, userId);
  if (!access) {
    return NextResponse.json({ error: "Урок недоступен" }, { status: 403 });
  }

  await saveLessonPosition(userId, lessonId, parsed.data.positionSec);
  return NextResponse.json({ ok: true });
}

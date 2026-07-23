import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getLesson, toggleLessonProgress } from "@/lib/lms";
import { getEffectiveUserId } from "@/lib/impersonation";
import { isTrustedOrigin } from "@/lib/security";

const schema = z.object({ completed: z.boolean() });

export async function POST(request: NextRequest, ctx: RouteContext<"/api/account/lessons/[lessonId]/progress">) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
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

  await toggleLessonProgress(userId, lessonId, parsed.data.completed);
  return NextResponse.json({ ok: true });
}

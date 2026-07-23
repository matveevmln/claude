import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLesson } from "@/lib/lms";
import { getEffectiveUserId } from "@/lib/impersonation";
import { isTrustedOrigin } from "@/lib/security";
import { rateLimit } from "@/lib/rateLimit";

const schema = z.object({ body: z.string().min(1).max(2000), parentId: z.string().optional() });

export async function POST(request: NextRequest, ctx: RouteContext<"/api/account/lessons/[lessonId]/comments">) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  if (!rateLimit(`lesson-comment:${session.user.id}`, { windowMs: 60_000, max: 10 })) {
    return NextResponse.json({ error: "Слишком много комментариев. Попробуйте позже." }, { status: 429 });
  }

  const { lessonId } = await ctx.params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Bad request" }, { status: 400 });
  }

  const { userId } = await getEffectiveUserId(session);
  const access = await getLesson(lessonId, userId);
  if (!access) {
    return NextResponse.json({ error: "Урок недоступен" }, { status: 403 });
  }

  const comment = await db.comment.create({
    data: { lessonId, userId, body: parsed.data.body, parentId: parsed.data.parentId },
  });

  return NextResponse.json({ ok: true, comment });
}

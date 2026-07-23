import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/requireAdmin";
import { isTrustedOrigin } from "@/lib/security";

const schema = z.object({
  index: z.number().int().min(1),
  title: z.string().min(1).max(200),
  summary: z.string().max(1000).optional(),
  videoUrl: z.string().max(500).optional(),
  pdfUrl: z.string().max(500).optional(),
  durationSec: z.number().int().min(0).optional(),
});

export async function POST(request: NextRequest, ctx: RouteContext<"/api/admin/modules/[moduleId]/lessons">) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { moduleId } = await ctx.params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Bad request" }, { status: 400 });
  }

  const lesson = await db.lesson.create({ data: { ...parsed.data, moduleId } });

  await db.adminAuditLog.create({
    data: { adminId: session.user.id, action: "create_lesson", payload: { moduleId, lessonId: lesson.id } },
  });

  return NextResponse.json({ ok: true, lesson });
}

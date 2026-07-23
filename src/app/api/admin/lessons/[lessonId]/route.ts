import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/requireAdmin";
import { isTrustedOrigin } from "@/lib/security";

const schema = z.object({
  index: z.number().int().min(1).optional(),
  title: z.string().min(1).max(200).optional(),
  summary: z.string().max(1000).nullable().optional(),
  videoUrl: z.string().max(500).nullable().optional(),
  pdfUrl: z.string().max(500).nullable().optional(),
  durationSec: z.number().int().min(0).nullable().optional(),
});

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/admin/lessons/[lessonId]">) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { lessonId } = await ctx.params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Bad request" }, { status: 400 });
  }

  const lesson = await db.lesson.update({ where: { id: lessonId }, data: parsed.data });

  await db.adminAuditLog.create({
    data: { adminId: session.user.id, action: "update_lesson", payload: { lessonId } },
  });

  return NextResponse.json({ ok: true, lesson });
}

export async function DELETE(request: NextRequest, ctx: RouteContext<"/api/admin/lessons/[lessonId]">) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { lessonId } = await ctx.params;
  await db.lesson.delete({ where: { id: lessonId } });

  await db.adminAuditLog.create({
    data: { adminId: session.user.id, action: "delete_lesson", payload: { lessonId } },
  });

  return NextResponse.json({ ok: true });
}

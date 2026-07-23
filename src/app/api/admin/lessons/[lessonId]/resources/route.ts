import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/requireAdmin";
import { isTrustedOrigin } from "@/lib/security";

const schema = z.object({
  title: z.string().min(1).max(200),
  url: z.string().min(1).max(500),
  kind: z.string().max(20).default("pdf"),
});

export async function POST(request: NextRequest, ctx: RouteContext<"/api/admin/lessons/[lessonId]/resources">) {
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

  const resource = await db.lessonResource.create({ data: { ...parsed.data, lessonId } });

  await db.adminAuditLog.create({
    data: { adminId: session.user.id, action: "create_lesson_resource", payload: { lessonId, resourceId: resource.id } },
  });

  return NextResponse.json({ ok: true, resource });
}

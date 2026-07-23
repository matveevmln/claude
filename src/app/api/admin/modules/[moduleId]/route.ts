import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/requireAdmin";
import { isTrustedOrigin } from "@/lib/security";

const schema = z.object({
  index: z.number().int().min(1).optional(),
  title: z.string().min(1).max(200).optional(),
  subtitle: z.string().max(300).nullable().optional(),
});

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/admin/modules/[moduleId]">) {
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

  const module_ = await db.module.update({ where: { id: moduleId }, data: parsed.data });

  await db.adminAuditLog.create({
    data: { adminId: session.user.id, action: "update_module", payload: { moduleId } },
  });

  return NextResponse.json({ ok: true, module: module_ });
}

export async function DELETE(request: NextRequest, ctx: RouteContext<"/api/admin/modules/[moduleId]">) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { moduleId } = await ctx.params;
  await db.module.delete({ where: { id: moduleId } });

  await db.adminAuditLog.create({
    data: { adminId: session.user.id, action: "delete_module", payload: { moduleId } },
  });

  return NextResponse.json({ ok: true });
}

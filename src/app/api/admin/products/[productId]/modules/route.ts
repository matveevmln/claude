import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/requireAdmin";
import { isTrustedOrigin } from "@/lib/security";

const schema = z.object({
  index: z.number().int().min(1),
  title: z.string().min(1).max(200),
  subtitle: z.string().max(300).optional(),
});

export async function POST(request: NextRequest, ctx: RouteContext<"/api/admin/products/[productId]/modules">) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { productId } = await ctx.params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Bad request" }, { status: 400 });
  }

  const module_ = await db.module.create({ data: { ...parsed.data, productId } });

  await db.adminAuditLog.create({
    data: { adminId: session.user.id, action: "create_module", payload: { productId, moduleId: module_.id } },
  });

  return NextResponse.json({ ok: true, module: module_ });
}

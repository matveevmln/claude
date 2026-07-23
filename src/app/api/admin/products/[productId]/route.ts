import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/requireAdmin";
import { isTrustedOrigin } from "@/lib/security";

const schema = z.object({
  name: z.string().min(2).max(200).optional(),
  type: z.string().min(1).max(40).optional(),
  description: z.string().max(2000).optional(),
  active: z.boolean().optional(),
});

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/admin/products/[productId]">) {
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

  const product = await db.product.update({ where: { id: productId }, data: parsed.data });

  await db.adminAuditLog.create({
    data: { adminId: session.user.id, action: "update_product", payload: { productId } },
  });

  return NextResponse.json({ ok: true, product });
}

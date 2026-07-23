import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/requireAdmin";
import { isTrustedOrigin } from "@/lib/security";

const schema = z.object({
  slug: z.string().min(1).max(40).regex(/^[a-z0-9-]+$/, "Только латиница, цифры и дефисы"),
  name: z.string().min(1).max(100),
  price: z.number().int().min(0),
  oldPrice: z.number().int().min(0).optional(),
  badge: z.string().max(60).optional(),
  features: z.array(z.string().max(200)).max(30).default([]),
});

export async function POST(request: NextRequest, ctx: RouteContext<"/api/admin/products/[productId]/tariffs">) {
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

  const tariff = await db.tariff.create({ data: { ...parsed.data, productId } });

  await db.adminAuditLog.create({
    data: { adminId: session.user.id, action: "create_tariff", payload: { productId, tariffId: tariff.id } },
  });

  return NextResponse.json({ ok: true, tariff });
}

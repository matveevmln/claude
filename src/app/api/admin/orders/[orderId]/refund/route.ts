import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/requireAdmin";
import { isTrustedOrigin } from "@/lib/security";

const schema = z.object({ reason: z.string().max(500).optional() });

export async function POST(request: NextRequest, ctx: RouteContext<"/api/admin/orders/[orderId]/refund">) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { orderId } = await ctx.params;
  const body = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Bad request" }, { status: 400 });
  }

  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.status === "REFUNDED") {
    return NextResponse.json({ error: "Уже возвращён" }, { status: 400 });
  }

  await db.$transaction([
    db.order.update({ where: { id: orderId }, data: { status: "REFUNDED" } }),
    db.refund.create({
      data: {
        orderId,
        amount: order.amount,
        reason: parsed.data.reason,
        processedBy: session.user.id,
      },
    }),
    db.orderEvent.create({
      data: { orderId, type: "refunded", payload: { reason: parsed.data.reason ?? null, adminId: session.user.id } },
    }),
  ]);

  await db.adminAuditLog.create({
    data: {
      adminId: session.user.id,
      action: "refund_order",
      targetUserId: order.userId ?? undefined,
      payload: { orderId, amount: order.amount },
    },
  });

  return NextResponse.json({ ok: true });
}

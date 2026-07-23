import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/** Polled by /thank-you while waiting for the webhook to confirm payment. */
export async function GET(_request: Request, ctx: RouteContext<"/api/orders/[orderId]/status">) {
  const { orderId } = await ctx.params;
  const order = await db.order.findUnique({ where: { id: orderId }, select: { status: true, email: true } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ status: order.status, email: order.email });
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/requireAdmin";
import { isTrustedOrigin } from "@/lib/security";

const schema = z.object({
  amount: z.number().int().min(1),
  periodStart: z.string(),
  periodEnd: z.string(),
});

export async function POST(request: NextRequest, ctx: RouteContext<"/api/admin/affiliates/[affiliateId]/payouts">) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { affiliateId } = await ctx.params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Bad request" }, { status: 400 });
  }

  const payout = await db.affiliatePayout.create({
    data: {
      affiliateId,
      amount: parsed.data.amount,
      periodStart: new Date(parsed.data.periodStart),
      periodEnd: new Date(parsed.data.periodEnd),
      paidAt: new Date(),
    },
  });

  await db.adminAuditLog.create({
    data: { adminId: session.user.id, action: "record_affiliate_payout", payload: { affiliateId, amount: parsed.data.amount } },
  });

  return NextResponse.json({ ok: true, payout });
}

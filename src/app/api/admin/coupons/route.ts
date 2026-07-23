import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/requireAdmin";
import { isTrustedOrigin } from "@/lib/security";

const schema = z.object({
  code: z.string().min(3).max(40),
  percentOff: z.number().int().min(1).max(100).optional(),
  amountOff: z.number().int().min(1).optional(),
  maxRedemptions: z.number().int().min(1).optional(),
  expiresAt: z.string().optional(),
});

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await requireAdminApi())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Bad request" }, { status: 400 });
  }

  const { code, percentOff, amountOff, maxRedemptions, expiresAt } = parsed.data;
  if (!percentOff && !amountOff) {
    return NextResponse.json({ error: "Укажите percentOff или amountOff" }, { status: 400 });
  }

  const coupon = await db.coupon.create({
    data: {
      code: code.toUpperCase(),
      percentOff,
      amountOff,
      maxRedemptions,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    },
  });

  return NextResponse.json(coupon);
}

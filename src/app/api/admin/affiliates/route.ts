import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "node:crypto";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/requireAdmin";
import { isTrustedOrigin } from "@/lib/security";
import { sendEmail } from "@/lib/email/send";
import { referralEmail } from "@/lib/email/templates/lifecycle";
import { site } from "@/config/site";

const schema = z.object({
  email: z.string().email(),
  commissionPercent: z.number().int().min(1).max(80).default(20),
});

function generateCode(): string {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Bad request" }, { status: 400 });
  }

  const { email, commissionPercent } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  const user = await db.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    return NextResponse.json({ error: "Пользователь с таким email не найден — сначала создайте аккаунт" }, { status: 404 });
  }

  const existing = await db.affiliatePartner.findUnique({ where: { userId: user.id } });
  if (existing) {
    return NextResponse.json({ error: "Этот пользователь уже партнёр" }, { status: 400 });
  }

  const code = generateCode();
  const affiliate = await db.affiliatePartner.create({
    data: { userId: user.id, code, commissionPercent },
  });

  await db.adminAuditLog.create({
    data: { adminId: session.user.id, action: "create_affiliate", targetUserId: user.id, payload: { code, commissionPercent } },
  });

  const referralUrl = `${site.domain}/?ref=${code}`;
  const { subject, html, text } = referralEmail({ name: user.name ?? "друг", referralUrl, commissionPercent });
  await sendEmail({ to: user.email, subject, html, text });

  return NextResponse.json({ ok: true, affiliate });
}

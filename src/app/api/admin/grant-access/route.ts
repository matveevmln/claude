import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { generateTempPassword, hashPassword } from "@/lib/password";
import { requireAdminApi } from "@/lib/requireAdmin";
import { isTrustedOrigin } from "@/lib/security";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
  tariffSlug: z.enum(["basic", "standard", "vip"]),
});

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

  const { email, name, tariffSlug } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  const tariff = await db.tariff.findFirstOrThrow({ where: { slug: tariffSlug } });

  let user = await db.user.findUnique({ where: { email: normalizedEmail } });
  let tempPassword: string | undefined;

  if (!user) {
    tempPassword = generateTempPassword();
    user = await db.user.create({
      data: {
        email: normalizedEmail,
        name,
        passwordHash: await hashPassword(tempPassword),
        emailVerified: new Date(),
      },
    });
  }

  await db.enrollment.upsert({
    where: { userId_tariffId: { userId: user.id, tariffId: tariff.id } },
    update: {},
    create: { userId: user.id, tariffId: tariff.id },
  });

  await db.notification.create({
    data: {
      userId: user.id,
      title: "Доступ открыт вручную",
      body: `Администратор открыл вам тариф «${tariff.name}».`,
    },
  });

  await db.adminAuditLog.create({
    data: {
      adminId: session.user.id,
      action: "grant_access",
      targetUserId: user.id,
      payload: { tariffSlug, isNewAccount: !!tempPassword },
    },
  });

  return NextResponse.json({ ok: true, isNewAccount: !!tempPassword, tempPassword });
}

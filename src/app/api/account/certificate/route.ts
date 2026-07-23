import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getEffectiveUserId } from "@/lib/impersonation";
import { getMemberCourseData } from "@/lib/lms";
import { isTrustedOrigin } from "@/lib/security";
import crypto from "node:crypto";

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  const { userId } = await getEffectiveUserId(session);
  const data = await getMemberCourseData(userId);
  if (data.progressPercent < 100 || !data.tariffName) {
    return NextResponse.json({ error: "Курс ещё не завершён" }, { status: 400 });
  }

  const highestTariffId = await db.enrollment
    .findMany({ where: { userId }, include: { tariff: true }, orderBy: { tariff: { price: "desc" } } })
    .then((rows) => rows[0]?.tariffId);
  if (!highestTariffId) {
    return NextResponse.json({ error: "Нет активного тарифа" }, { status: 400 });
  }

  const existing = await db.certificate.findFirst({ where: { userId, tariffId: highestTariffId } });
  if (existing) {
    return NextResponse.json({ ok: true, serial: existing.serial });
  }

  const serial = crypto.randomBytes(6).toString("hex").toUpperCase();
  const certificate = await db.certificate.create({ data: { userId, tariffId: highestTariffId, serial } });

  return NextResponse.json({ ok: true, serial: certificate.serial });
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { site } from "@/config/site";
import { sendEmail } from "@/lib/email/send";
import { onboardingDripEmail } from "@/lib/email/templates/lifecycle";
import { isAuthorizedCronRequest } from "@/lib/cronAuth";
import { reportError } from "@/lib/logger";

const DRIP_SCHEDULE = [
  {
    day: 1,
    eventType: "onboarding_drip_day1_sent",
    title: "Начните с модуля 1 — вот с чего проще всего стартовать",
    message:
      "Первый урок «Классический бисквит» — фундамент для всего курса. Уделите ему 15 минут сегодня, и остальное пойдёт легче.",
    ctaLabel: "Открыть курс",
  },
  {
    day: 3,
    eventType: "onboarding_drip_day3_sent",
    title: "Как продвигается обучение?",
    message:
      "Многие ученицы к 3 дню уже проходят модуль 2 — кремы и начинки. Если застряли на каком-то шаге, загляните в чек-листы: они закрывают 90% типичных вопросов.",
    ctaLabel: "Продолжить курс",
  },
  {
    day: 7,
    eventType: "onboarding_drip_day7_sent",
    title: "Неделя обучения — самое время закрепить результат",
    message:
      "Через неделю после старта — лучший момент, чтобы не растерять темп. Откройте личный кабинет и посмотрите свой прогресс: возможно, до сертификата ближе, чем кажется.",
    ctaLabel: "Посмотреть прогресс",
  },
] as const;

/**
 * Scheduled job: sends a 3-touch onboarding drip (day 1 / 3 / 7 after
 * enrollment) to paid customers. Intended to run daily.
 */
export async function POST(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = Date.now();
  let sent = 0;
  let scanned = 0;

  for (const step of DRIP_SCHEDULE) {
    const windowStart = new Date(now - (step.day + 1) * 24 * 60 * 60 * 1000);
    const windowEnd = new Date(now - step.day * 24 * 60 * 60 * 1000);

    const orders = await db.order.findMany({
      where: { status: "PAID", paidAt: { gte: windowStart, lte: windowEnd } },
      include: { events: { select: { type: true } } },
      take: 200,
    });
    scanned += orders.length;

    for (const order of orders) {
      if (order.events.some((e) => e.type === step.eventType)) continue;

      try {
        const { subject, html, text } = onboardingDripEmail({
          name: order.name ?? "друг",
          day: step.day,
          title: step.title,
          message: step.message,
          ctaUrl: `${site.domain}/account/course`,
          ctaLabel: step.ctaLabel,
        });
        await sendEmail({ to: order.email, subject, html, text });
        await db.orderEvent.create({ data: { orderId: order.id, type: step.eventType } });
        sent++;
      } catch (err) {
        reportError("cron/onboarding-drip", err, { orderId: order.id, day: step.day });
      }
    }
  }

  return NextResponse.json({ ok: true, scanned, sent });
}

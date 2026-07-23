import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { site } from "@/config/site";
import { sendEmail } from "@/lib/email/send";
import { upsellEmail } from "@/lib/email/templates/lifecycle";
import { isAuthorizedCronRequest } from "@/lib/cronAuth";
import { reportError } from "@/lib/logger";

const WINDOW_START_DAYS = 6;
const WINDOW_END_DAYS = 5;
const EVENT_TYPE = "upsell_nudge_sent";

/**
 * Scheduled job: 5 days after a customer buys the entry-level ("basic")
 * tariff, offers an upgrade if they haven't already bought a higher one.
 * Intended to run daily.
 */
export async function POST(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const windowStart = new Date(Date.now() - WINDOW_START_DAYS * 24 * 60 * 60 * 1000);
  const windowEnd = new Date(Date.now() - WINDOW_END_DAYS * 24 * 60 * 60 * 1000);

  const orders = await db.order.findMany({
    where: {
      status: "PAID",
      paidAt: { gte: windowStart, lte: windowEnd },
      tariff: { slug: "basic" },
    },
    include: { tariff: true, events: { select: { type: true } }, user: { include: { enrollments: { include: { tariff: true } } } } },
    take: 200,
  });

  let sent = 0;
  for (const order of orders) {
    if (order.events.some((e) => e.type === EVENT_TYPE)) continue;

    const hasHigherTariff = order.user?.enrollments.some((e) => e.tariff.price > order.tariff.price) ?? false;
    if (hasHigherTariff) continue;

    try {
      const { subject, html, text } = upsellEmail({
        name: order.name ?? "друг",
        offerTitle: "Откройте больше на тарифе «Стандарт»",
        offerDescription:
          "Технологические карты, чек-листы к каждому уроку, закрытый Telegram-чат и именной сертификат — доступны при апгрейде с «Базового».",
        ctaUrl: `${site.domain}/account/upgrade`,
      });
      await sendEmail({ to: order.email, subject, html, text });
      await db.orderEvent.create({ data: { orderId: order.id, type: EVENT_TYPE } });
      sent++;
    } catch (err) {
      reportError("cron/upsell-nudge", err, { orderId: order.id });
    }
  }

  return NextResponse.json({ ok: true, scanned: orders.length, sent });
}

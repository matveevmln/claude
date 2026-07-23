import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { site } from "@/config/site";
import { sendEmail } from "@/lib/email/send";
import { abandonedCheckoutEmail } from "@/lib/email/templates/lifecycle";
import { isAuthorizedCronRequest } from "@/lib/cronAuth";
import { reportError } from "@/lib/logger";

const MIN_AGE_MS = 60 * 60 * 1000; // don't nag someone who abandoned 5 minutes ago
const MAX_AGE_MS = 48 * 60 * 60 * 1000; // stale beyond this — the price/session context is gone

/**
 * Scheduled job: finds checkouts that were started (Order row created) but
 * never paid, and never already nudged, and sends one recovery email.
 * Intended to run hourly — see docs/deployment.md for the cron setup.
 */
export async function POST(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = Date.now();
  const candidates = await db.order.findMany({
    where: {
      status: "PENDING",
      createdAt: { lte: new Date(now - MIN_AGE_MS), gte: new Date(now - MAX_AGE_MS) },
    },
    include: { tariff: true, events: { select: { type: true } } },
    take: 200,
  });

  let sent = 0;
  for (const order of candidates) {
    const alreadySent = order.events.some((e) => e.type === "abandoned_cart_email_sent");
    if (alreadySent) continue;

    try {
      const { subject, html, text } = abandonedCheckoutEmail({
        name: order.name ?? "друг",
        tariffName: order.tariff.name,
        checkoutUrl: `${site.domain}/#pricing`,
      });
      await sendEmail({ to: order.email, subject, html, text });
      await db.orderEvent.create({ data: { orderId: order.id, type: "abandoned_cart_email_sent" } });
      sent++;
    } catch (err) {
      reportError("cron/abandoned-cart", err, { orderId: order.id });
    }
  }

  return NextResponse.json({ ok: true, scanned: candidates.length, sent });
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { site } from "@/config/site";
import { sendEmail } from "@/lib/email/send";
import { reactivationEmail } from "@/lib/email/templates/lifecycle";
import { isAuthorizedCronRequest } from "@/lib/cronAuth";
import { reportError } from "@/lib/logger";

const INACTIVITY_DAYS = 14;
const RESEND_COOLDOWN_DAYS = 30; // don't nag again for a month after one reactivation email

/**
 * Scheduled job: nudges customers who haven't opened a lesson in
 * INACTIVITY_DAYS. Intended to run weekly.
 */
export async function POST(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const inactivityCutoff = new Date(Date.now() - INACTIVITY_DAYS * 24 * 60 * 60 * 1000);
  const cooldownCutoff = new Date(Date.now() - RESEND_COOLDOWN_DAYS * 24 * 60 * 60 * 1000);

  const candidates = await db.user.findMany({
    where: {
      role: "CUSTOMER",
      enrollments: { some: {} },
      createdAt: { lte: inactivityCutoff },
    },
    include: {
      progress: { orderBy: { lastViewedAt: "desc" }, take: 1 },
      orders: { where: { status: "PAID" }, orderBy: { createdAt: "desc" }, take: 1, include: { events: true } },
    },
    take: 300,
  });

  let sent = 0;
  for (const user of candidates) {
    const lastViewed = user.progress[0]?.lastViewedAt;
    const isInactive = !lastViewed || lastViewed <= inactivityCutoff;
    if (!isInactive) continue;

    const latestOrder = user.orders[0];
    if (!latestOrder) continue; // no paid order to attach the event/idempotency marker to

    const recentlyNudged = latestOrder.events.some(
      (e) => e.type === "reactivation_email_sent" && e.createdAt > cooldownCutoff
    );
    if (recentlyNudged) continue;

    try {
      const { subject, html, text } = reactivationEmail({
        name: user.name ?? "друг",
        loginUrl: `${site.domain}/login`,
      });
      await sendEmail({ to: user.email, subject, html, text });
      await db.orderEvent.create({ data: { orderId: latestOrder.id, type: "reactivation_email_sent" } });
      sent++;
    } catch (err) {
      reportError("cron/reactivation", err, { userId: user.id });
    }
  }

  return NextResponse.json({ ok: true, scanned: candidates.length, sent });
}

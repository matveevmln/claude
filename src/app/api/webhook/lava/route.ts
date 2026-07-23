import { NextRequest, NextResponse } from "next/server";
import { LavaProvider } from "@/lib/payments/lava";
import { db } from "@/lib/db";
import { provisionCustomerAccount } from "@/lib/accounts";
import { sendEmail } from "@/lib/email/send";
import { welcomeEmail, accessGrantedEmail, receiptEmail } from "@/lib/email/templates/transactional";
import { trackServerPurchase } from "@/lib/serverTracking";
import { reportError } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const provider = new LavaProvider();
    const event = await provider.parseWebhook(request);

    const order = await db.order.findUnique({
      where: { providerOrderId: event.providerOrderId },
      include: { tariff: { include: { product: true } }, coupon: true },
    });

    if (!order) {
      reportError("webhook/lava", "No matching Order", { providerOrderId: event.providerOrderId });
      return NextResponse.json({ ok: false, error: "Unknown order" }, { status: 404 });
    }

    // Idempotency: webhooks can retry. Once paid, do nothing further.
    if (order.status === "PAID") {
      return NextResponse.json({ ok: true, alreadyProcessed: true });
    }

    if (event.status !== "paid") {
      await db.order.update({
        where: { id: order.id },
        data: {
          status: event.status === "failed" ? "FAILED" : order.status,
          events: { create: { type: `payment_${event.status}`, payload: JSON.parse(JSON.stringify(event.raw)) } },
        },
      });
      return NextResponse.json({ ok: true });
    }

    await db.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        paidAt: new Date(),
        events: { create: { type: "payment_confirmed", payload: JSON.parse(JSON.stringify(event.raw)) } },
      },
    });

    if (order.couponId) {
      await db.coupon.update({ where: { id: order.couponId }, data: { timesRedeemed: { increment: 1 } } });
    }

    const { userId, isNewAccount, tempPassword } = await provisionCustomerAccount({
      email: order.email,
      name: order.name ?? undefined,
      tariffSlug: order.tariff.slug,
      productSlug: order.tariff.product.slug,
      orderId: order.id,
    });

    await db.orderEvent.create({
      data: { orderId: order.id, type: "account_provisioned", payload: { userId, isNewAccount } },
    });

    if (isNewAccount && tempPassword) {
      const { subject, html, text } = welcomeEmail({
        name: order.name ?? "друг",
        email: order.email,
        tempPassword,
        tariffName: order.tariff.name,
        orderId: order.id,
      });
      await sendEmail({ to: order.email, subject, html, text });
    } else {
      const { subject, html, text } = accessGrantedEmail({
        name: order.name ?? "друг",
        tariffName: order.tariff.name,
      });
      await sendEmail({ to: order.email, subject, html, text });
    }

    const receipt = receiptEmail({
      name: order.name ?? "друг",
      tariffName: order.tariff.name,
      amount: order.amount,
      orderId: order.id,
      paidAt: new Date(),
    });
    await sendEmail({ to: order.email, subject: receipt.subject, html: receipt.html, text: receipt.text });

    await db.orderEvent.create({ data: { orderId: order.id, type: "emails_sent" } });

    // Telegram: Bot API can't DM a user who hasn't started a conversation
    // with the bot first — see docs/telegram-onboarding.md for the deep-link
    // flow (t.me/<bot>?start=<orderId>) that makes this possible.
    if (process.env.TELEGRAM_BOT_TOKEN) {
      await db.orderEvent.create({
        data: { orderId: order.id, type: "telegram_invite_pending", payload: { note: "awaiting /start deep link" } },
      });
    }

    await trackServerPurchase({
      orderId: order.id,
      email: order.email,
      amount: order.amount,
      currency: order.currency,
      tariffName: order.tariff.name,
    });
    await db.orderEvent.create({ data: { orderId: order.id, type: "server_conversion_tracked" } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    reportError("webhook/lava", err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPaymentProvider } from "@/lib/payments";
import { site } from "@/config/site";
import { db } from "@/lib/db";
import { PaymentProviderName } from "@/generated/prisma/enums";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { isTrustedOrigin } from "@/lib/security";
import { reportError } from "@/lib/logger";

const checkoutSchema = z.object({
  tariffId: z.string().min(1).max(40),
  productSlug: z.string().min(1).max(80).default(site.primaryProductSlug),
  name: z.string().min(2, "Укажите имя").max(100),
  email: z.string().email("Некорректный email"),
  telegramUsername: z.string().max(100).optional(),
  couponCode: z.string().max(40).optional(),
  utm: z.record(z.string(), z.string().optional()).optional(),
});

const PROVIDER_ENUM: Record<string, PaymentProviderName> = {
  lava: PaymentProviderName.LAVA,
  yookassa: PaymentProviderName.YOOKASSA,
  stripe: PaymentProviderName.STRIPE,
  paypal: PaymentProviderName.PAYPAL,
};

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = getClientIp(request);
  if (!rateLimit(`checkout:${ip}`, { windowMs: 10 * 60 * 1000, max: 20 })) {
    return NextResponse.json({ error: "Слишком много попыток. Попробуйте позже." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Bad request" }, { status: 400 });
  }

  const { tariffId, productSlug, name, email, telegramUsername, couponCode, utm } = parsed.data;

  // Tariff slugs are only unique per-product (e.g. two products can each
  // have a "standard" tariff) — always scope the lookup by product.
  const dbTariff = await db.tariff.findFirst({
    where: { slug: tariffId, active: true, product: { slug: productSlug, active: true } },
  });
  if (!dbTariff) {
    return NextResponse.json({ error: "Тариф не найден" }, { status: 404 });
  }

  let amount = dbTariff.price;
  let couponId: string | undefined;

  if (couponCode) {
    const coupon = await db.coupon.findUnique({ where: { code: couponCode.trim().toUpperCase() } });
    const valid =
      coupon &&
      coupon.active &&
      (!coupon.expiresAt || coupon.expiresAt > new Date()) &&
      (!coupon.maxRedemptions || coupon.timesRedeemed < coupon.maxRedemptions);

    if (!valid) {
      return NextResponse.json({ error: "Купон недействителен или срок его действия истёк" }, { status: 400 });
    }

    couponId = coupon.id;
    if (coupon.percentOff) amount = Math.round(amount * (1 - coupon.percentOff / 100));
    else if (coupon.amountOff) amount = Math.max(0, amount - coupon.amountOff);
  }

  const providerName = PROVIDER_ENUM[process.env.PAYMENT_PROVIDER ?? "lava"] ?? PaymentProviderName.LAVA;

  const order = await db.order.create({
    data: {
      email,
      name,
      tariffId: dbTariff.id,
      amount,
      currency: site.currency,
      provider: providerName,
      couponId,
      utmSource: utm?.utm_source,
      utmMedium: utm?.utm_medium,
      utmCampaign: utm?.utm_campaign,
      utmContent: utm?.utm_content,
      utmTerm: utm?.utm_term,
      events: { create: { type: "created", payload: { telegramUsername } } },
    },
  });

  try {
    const provider = getPaymentProvider();
    const result = await provider.createCheckout({
      orderId: order.id,
      tariffId,
      providerOfferId: dbTariff.providerOfferId ?? undefined,
      amount,
      currency: site.currency,
      email,
      name,
      telegramUsername,
      utm,
    });

    await db.order.update({
      where: { id: order.id },
      data: {
        providerOrderId: result.providerOrderId,
        events: { create: { type: "provider_invoice_created", payload: { providerOrderId: result.providerOrderId } } },
      },
    });

    return NextResponse.json({ ...result, orderId: order.id });
  } catch (err) {
    reportError("checkout", err, { orderId: order.id });
    await db.order.update({
      where: { id: order.id },
      data: {
        status: "FAILED",
        events: { create: { type: "provider_error", payload: { message: String(err) } } },
      },
    });
    const message = err instanceof Error ? err.message : "Payment provider error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

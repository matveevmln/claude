import type { CheckoutInput, CheckoutResult, PaymentProvider, WebhookEvent } from "./types";
import { timingSafeStringEqual } from "@/lib/security";

/**
 * Lava.top integration.
 *
 * IMPORTANT: this environment has no outbound network access to verify the
 * current Lava.top API contract against live docs (docs.lava.top). Field
 * names below follow their publicly documented v2 invoice flow as of last
 * training data and may drift — confirm `LAVA_API_BASE`, the request body
 * shape, and the webhook payload against your Lava.top dashboard / current
 * docs before going live, then adjust the two request/parse spots below.
 * Everything else (checkout flow, delivery, UI) does not need to change.
 */
export class LavaProvider implements PaymentProvider {
  readonly id = "lava";

  private apiKey = process.env.LAVA_API_KEY ?? "";
  private shopId = process.env.LAVA_SHOP_ID ?? "";
  /** Legacy fallback for the original three tariffs, kept for backward compat with existing env setups. */
  private legacyOfferIds: Record<string, string> = {
    basic: process.env.LAVA_OFFER_ID_BASIC ?? "",
    standard: process.env.LAVA_OFFER_ID_STANDARD ?? "",
    vip: process.env.LAVA_OFFER_ID_VIP ?? "",
  };
  private apiBase = process.env.LAVA_API_BASE ?? "https://gate.lava.top/api/v2";
  private webhookSecret = process.env.LAVA_WEBHOOK_SECRET ?? "";

  async createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
    if (!this.apiKey) {
      throw new Error(
        "LAVA_API_KEY is not set. Add your Lava.top credentials to .env.local before accepting real payments."
      );
    }

    // Prefer the offer ID configured per-tariff in the admin CMS
    // (Tariff.providerOfferId) so new products/tariffs don't need a code
    // change + env var for every one — fall back to the legacy env-var
    // mapping for the original basic/standard/vip tariffs.
    const offerId = input.providerOfferId || this.legacyOfferIds[input.tariffId];
    if (!offerId) {
      throw new Error(
        `No Lava.top offerId configured for tariff "${input.tariffId}" — set it on the tariff in /admin/products.`
      );
    }

    const res = await fetch(`${this.apiBase}/invoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": this.apiKey,
      },
      body: JSON.stringify({
        shopId: this.shopId,
        offerId,
        email: input.email,
        currency: input.currency,
        buyerLanguage: "RU",
        periodicity: "ONE_TIME",
        clientUtm: input.utm ?? {},
        returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/thank-you?order=${input.orderId}`,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Lava.top invoice creation failed (${res.status}): ${text}`);
    }

    const data = (await res.json()) as { id?: string; paymentUrl?: string; url?: string };
    const paymentUrl = data.paymentUrl ?? data.url;
    if (!paymentUrl || !data.id) {
      throw new Error("Lava.top response missing paymentUrl/id — verify API contract in lib/payments/lava.ts");
    }

    return { paymentUrl, providerOrderId: data.id };
  }

  async parseWebhook(request: Request): Promise<WebhookEvent> {
    if (!this.webhookSecret) {
      // Fail closed in production: an unsigned webhook endpoint would let
      // anyone POST a fake "payment confirmed" event for any order id and
      // get free access granted. Dev/staging without a secret still works
      // (see .env.example) so local testing isn't blocked.
      if (process.env.NODE_ENV === "production") {
        throw new Error("LAVA_WEBHOOK_SECRET is not set — refusing to process webhooks in production.");
      }
    } else {
      const signature = request.headers.get("x-lava-signature") ?? "";
      if (!timingSafeStringEqual(signature, this.webhookSecret)) {
        throw new Error("Invalid Lava.top webhook signature");
      }
    }

    const body = (await request.json()) as {
      id?: string;
      status?: string;
      offerId?: string;
      buyer?: { email?: string };
      amount?: number;
    };

    const statusMap: Record<string, WebhookEvent["status"]> = {
      completed: "paid",
      paid: "paid",
      success: "paid",
      failed: "failed",
      cancelled: "failed",
    };

    const tariffId = (Object.entries(this.legacyOfferIds) as [string, string][]).find(
      ([, offerId]) => offerId && offerId === body.offerId
    )?.[0];

    return {
      providerOrderId: body.id ?? "",
      status: statusMap[(body.status ?? "").toLowerCase()] ?? "pending",
      email: body.buyer?.email ?? "",
      amount: body.amount ?? 0,
      tariffId,
      raw: body,
    };
  }
}

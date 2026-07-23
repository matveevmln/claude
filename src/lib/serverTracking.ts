import { site } from "@/config/site";
import { withRetry } from "@/lib/retry";

type PurchaseEvent = {
  orderId: string;
  email: string;
  amount: number;
  currency: string;
  tariffName: string;
};

/**
 * Server-side conversion tracking, fired from the payment webhook — more
 * reliable than client-side pixel events since it isn't affected by ad
 * blockers or the buyer closing the tab before the client-side "Purchase"
 * event fires. No-ops per-channel until the matching env var is set.
 */
export async function trackServerPurchase(event: PurchaseEvent): Promise<void> {
  await Promise.all([trackMetaConversionsApi(event), trackGa4MeasurementProtocol(event)]);
}

async function trackMetaConversionsApi({ orderId, email, amount, currency }: PurchaseEvent) {
  const pixelId = site.analytics.metaPixelId;
  const token = process.env.META_CONVERSIONS_API_TOKEN;
  if (!pixelId || !token) return;

  const emailHash = await sha256Hex(email.trim().toLowerCase());

  try {
    await withRetry(
      async () => {
        const res = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${token}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: [
              {
                event_name: "Purchase",
                event_time: Math.floor(Date.now() / 1000),
                event_id: orderId,
                action_source: "website",
                user_data: { em: [emailHash] },
                custom_data: { currency, value: amount },
              },
            ],
          }),
        });
        if (!res.ok) throw new Error(`Meta Conversions API responded ${res.status}`);
      },
      { label: `Meta CAPI purchase ${orderId}` }
    );
  } catch (err) {
    console.error("[tracking] Meta Conversions API failed after retries", err);
  }
}

async function trackGa4MeasurementProtocol({ orderId, amount, currency, tariffName }: PurchaseEvent) {
  const measurementId = site.analytics.gaId;
  const apiSecret = process.env.GA4_MEASUREMENT_API_SECRET;
  if (!measurementId || !apiSecret) return;

  try {
    await withRetry(
      async () => {
        const res = await fetch(
          `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
          {
            method: "POST",
            body: JSON.stringify({
              client_id: orderId,
              events: [
                {
                  name: "purchase",
                  params: {
                    transaction_id: orderId,
                    value: amount,
                    currency,
                    items: [{ item_name: tariffName, price: amount, quantity: 1 }],
                  },
                },
              ],
            }),
          }
        );
        if (!res.ok) throw new Error(`GA4 Measurement Protocol responded ${res.status}`);
      },
      { label: `GA4 MP purchase ${orderId}` }
    );
  } catch (err) {
    console.error("[tracking] GA4 Measurement Protocol failed after retries", err);
  }
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

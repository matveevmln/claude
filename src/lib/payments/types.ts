export type CheckoutInput = {
  /** Our internal Order.id — pass through as the payment provider's return-URL param so /thank-you can look it up. */
  orderId: string;
  tariffId: string;
  /** Optional provider-specific offer/price ID stored on the Tariff row (see Tariff.providerOfferId). */
  providerOfferId?: string;
  amount: number;
  currency: string;
  email: string;
  name: string;
  telegramUsername?: string;
  utm?: Record<string, string | undefined>;
};

export type CheckoutResult = {
  paymentUrl: string;
  providerOrderId: string;
};

export type WebhookEvent = {
  providerOrderId: string;
  status: "paid" | "failed" | "pending";
  email: string;
  amount: number;
  tariffId?: string;
  raw: unknown;
};

export interface PaymentProvider {
  readonly id: string;
  createCheckout(input: CheckoutInput): Promise<CheckoutResult>;
  parseWebhook(request: Request): Promise<WebhookEvent>;
}

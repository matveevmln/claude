import type { CheckoutInput, CheckoutResult, PaymentProvider, WebhookEvent } from "./types";

/** Shared "not wired up yet" behavior for providers this deployment doesn't use yet. */
function notConfigured(id: string): never {
  throw new Error(
    `Payment provider "${id}" is not implemented in this deployment. Implement lib/payments/${id}.ts following the PaymentProvider interface (see lib/payments/lava.ts for a worked example), or set PAYMENT_PROVIDER=lava.`
  );
}

export class YookassaProvider implements PaymentProvider {
  readonly id = "yookassa";
  async createCheckout(_input: CheckoutInput): Promise<CheckoutResult> {
    return notConfigured(this.id);
  }
  async parseWebhook(_request: Request): Promise<WebhookEvent> {
    return notConfigured(this.id);
  }
}

export class StripeProvider implements PaymentProvider {
  readonly id = "stripe";
  async createCheckout(_input: CheckoutInput): Promise<CheckoutResult> {
    return notConfigured(this.id);
  }
  async parseWebhook(_request: Request): Promise<WebhookEvent> {
    return notConfigured(this.id);
  }
}

export class PaypalProvider implements PaymentProvider {
  readonly id = "paypal";
  async createCheckout(_input: CheckoutInput): Promise<CheckoutResult> {
    return notConfigured(this.id);
  }
  async parseWebhook(_request: Request): Promise<WebhookEvent> {
    return notConfigured(this.id);
  }
}

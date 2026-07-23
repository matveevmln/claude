import type { PaymentProvider } from "./types";
import { LavaProvider } from "./lava";
import { YookassaProvider, StripeProvider, PaypalProvider } from "./stubs";

export function getPaymentProvider(): PaymentProvider {
  const name = process.env.PAYMENT_PROVIDER ?? "lava";
  switch (name) {
    case "lava":
      return new LavaProvider();
    case "yookassa":
      return new YookassaProvider();
    case "stripe":
      return new StripeProvider();
    case "paypal":
      return new PaypalProvider();
    default:
      throw new Error(`Unknown PAYMENT_PROVIDER "${name}"`);
  }
}

export type { CheckoutInput, CheckoutResult, WebhookEvent, PaymentProvider } from "./types";

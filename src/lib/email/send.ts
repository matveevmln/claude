import { site } from "@/config/site";
import { withRetry } from "@/lib/retry";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

/**
 * Low-level transport. Uses Resend when RESEND_API_KEY is set; otherwise
 * logs the email so the rest of the automation pipeline (webhook → account
 * → email → Telegram → logging) can be exercised end-to-end without real
 * credentials.
 *
 * Never throws — a transient email failure should not fail the caller's
 * critical path (e.g. payment webhook processing). Retries transient
 * network errors internally; a permanent failure is logged, not thrown.
 */
export async function sendEmail({ to, subject, html, text }: SendEmailInput): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn(`[email] RESEND_API_KEY not set — logging instead of sending to ${to}`, {
      subject,
    });
    return;
  }

  try {
    await withRetry(
      async () => {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL ?? `${site.brand} <hello@dom-desertov.ru>`,
            to,
            subject,
            html,
            text,
          }),
        });
        if (!res.ok) {
          const body = await res.text().catch(() => "");
          throw new Error(`Resend responded ${res.status}: ${body}`);
        }
      },
      { label: `email to ${to}` }
    );
  } catch (err) {
    console.error(`[email] giving up on ${to} after retries`, err);
  }
}

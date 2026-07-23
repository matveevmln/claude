import { withRetry } from "@/lib/retry";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

/** Never throws — see sendEmail for why. */
export async function sendTelegramMessage(chatId: string, text: string): Promise<void> {
  if (!BOT_TOKEN) {
    console.warn(`[telegram] TELEGRAM_BOT_TOKEN not set — logging instead of sending to ${chatId}`, { text });
    return;
  }

  try {
    await withRetry(
      async () => {
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
        });
        if (!res.ok) {
          const body = await res.text().catch(() => "");
          throw new Error(`Telegram API responded ${res.status}: ${body}`);
        }
      },
      { label: `telegram message to ${chatId}` }
    );
  } catch (err) {
    console.error(`[telegram] giving up on ${chatId} after retries`, err);
  }
}

export function buildTelegramDeepLink(orderId: string): string {
  const botUsername = process.env.TELEGRAM_BOT_USERNAME || "dom_desertov_bot";
  return `https://t.me/${botUsername}?start=${orderId}`;
}

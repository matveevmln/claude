import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendTelegramMessage } from "@/lib/telegram";
import { timingSafeStringEqual } from "@/lib/security";
import { rateLimit } from "@/lib/rateLimit";

type TelegramUpdate = {
  message?: {
    text?: string;
    chat: { id: number };
    from?: { username?: string };
  };
};

const WELCOME_LINKED = "Отлично, аккаунт привязан! Личный кабинет: ";
const WELCOME_UNLINKED =
  "Привет! Чтобы привязать этот чат к покупке, перейдите по ссылке из письма после оплаты.";

export async function POST(request: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret) {
    const provided = request.headers.get("x-telegram-bot-api-secret-token") ?? "";
    if (!timingSafeStringEqual(provided, secret)) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    console.error("[telegram/webhook] TELEGRAM_WEBHOOK_SECRET not set — refusing to process in production.");
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const update = (await request.json().catch(() => null)) as TelegramUpdate | null;
  const message = update?.message;
  if (!message?.text) return NextResponse.json({ ok: true });

  const chatId = String(message.chat.id);
  const [command, orderId] = message.text.trim().split(/\s+/);

  if (command === "/start" && orderId) {
    if (!rateLimit(`telegram:${chatId}`, { windowMs: 60_000, max: 5 })) {
      return NextResponse.json({ ok: false }, { status: 429 });
    }

    const order = await db.order.findUnique({ where: { id: orderId }, select: { userId: true } });
    if (order?.userId) {
      const existingUser = await db.user.findUnique({ where: { id: order.userId }, select: { telegramChatId: true } });
      if (existingUser?.telegramChatId && existingUser.telegramChatId !== chatId) {
        await sendTelegramMessage(
          chatId,
          "Этот аккаунт уже привязан к другому Telegram-чату. Если это ошибка — напишите в поддержку."
        );
        return NextResponse.json({ ok: true });
      }

      await db.user.update({
        where: { id: order.userId },
        data: { telegramChatId: chatId, telegramUsername: message.from?.username },
      });
      await db.orderEvent.create({
        data: { orderId, type: "telegram_linked", payload: { chatId, username: message.from?.username } },
      });
      await sendTelegramMessage(chatId, `${WELCOME_LINKED}${process.env.NEXT_PUBLIC_SITE_URL}/account`);
      return NextResponse.json({ ok: true });
    }
  }

  await sendTelegramMessage(chatId, WELCOME_UNLINKED);
  return NextResponse.json({ ok: true });
}

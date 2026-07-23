# Telegram-бот: подключение и deep-link флоу

## Почему нужен deep-link, а не просто отправка сообщения

Telegram Bot API не позволяет боту первым написать пользователю, который
никогда не начинал с ним диалог (`chat not found` / `bot was blocked by
the user`). Поэтому после оплаты мы не можем просто отправить сообщение
в Telegram по номеру телефона или email — нужно, чтобы **пользователь сам
нажал "Start" в чате с ботом**, и только тогда бот узнаёт его `chat_id`.

Решение — **deep link с параметром**: `https://t.me/<bot>?start=<orderId>`.
Когда пользователь переходит по такой ссылке и нажимает Start, Telegram
отправляет боту апдейт `/start <orderId>` — и мы можем связать этот
`chat_id` с конкретным заказом/аккаунтом.

## Поток целиком

1. Клиент оплачивает курс → вебхук `/api/webhook/lava` помечает заказ
   `PAID` и создаёт/находит аккаунт (`provisionCustomerAccount`).
2. Приветственное письмо (`welcomeEmail`, см.
   `src/lib/email/templates/transactional.ts`) содержит кнопку
   "Открыть Telegram", которая ведёт на
   `buildTelegramDeepLink(orderId)` → `https://t.me/<bot>?start=<orderId>`
   (см. `src/lib/telegram.ts`).
3. Клиент нажимает кнопку → Telegram открывает чат с ботом → клиент жмёт
   Start.
4. Telegram шлёт апдейт на наш вебхук `/api/telegram/webhook`
   (`{message: {text: "/start <orderId>", chat: {id}, from: {username}}}`).
5. Обработчик (`src/app/api/telegram/webhook/route.ts`):
   - проверяет секрет вебхука (timing-safe сравнение, fail-closed в
     продакшене — см. код),
   - рейт-лимитит попытки по `chatId` (5/мин),
   - находит `Order` по `orderId`, берёт его `userId`,
   - если у пользователя уже привязан **другой** `chat_id` — отказывает
     и просит написать в поддержку (защита от повторной привязки чужого
     чата),
   - иначе сохраняет `telegramChatId`/`telegramUsername` на `User` и
     логирует событие `telegram_linked` в `OrderEvent`,
   - отвечает приветственным сообщением со ссылкой на личный кабинет.

## Настройка бота (шаг за шагом)

1. Напишите [@BotFather](https://t.me/BotFather) → `/newbot` → задайте
   имя и username (например `dom_desertov_bot`).
2. Сохраните выданный токен как `TELEGRAM_BOT_TOKEN` в `.env`.
3. Задайте `TELEGRAM_BOT_USERNAME` (без `@`) — используется для сборки
   deep-link.
4. Сгенерируйте случайный секрет и сохраните как `TELEGRAM_WEBHOOK_SECRET`.
5. Зарегистрируйте вебхук (замените `<TOKEN>`, `<SECRET>`, `<DOMAIN>`):
   ```bash
   curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
     -d "url=https://<DOMAIN>/api/telegram/webhook" \
     -d "secret_token=<SECRET>"
   ```
6. Проверьте регистрацию:
   ```bash
   curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
   ```
   `url` должен совпадать, `last_error_message` — пустой.

## Закрытый чат учениц (тариф Стандарт/VIP)

Отдельно от бота — обычная приватная Telegram-группа/канал. Ссылка на
вступление отдаётся вручную или через отдельный инвайт-бот; она не
завязана на описанный выше deep-link флоу (это два разных механизма:
бот — для связи аккаунта с чатом уведомлений, группа — для комьюнити).
Ссылку на группу можно захардкодить в `site.channelTelegram`
(`src/config/site.ts`) или включить в приветственное письмо отдельным
блоком.

## Локальная разработка без реального бота

Если `TELEGRAM_BOT_TOKEN` не задан, `sendTelegramMessage()` не бросает
ошибку — просто логирует сообщение в консоль (`src/lib/telegram.ts`).
Это позволяет прогонять весь пайплайн (вебхук → аккаунт → письма →
Telegram → логирование) локально без реальных credentials.

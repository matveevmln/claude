# Деплой

## Вариант 1 — Docker Compose (свой сервер / VPS)

```bash
cp .env.example .env.production   # заполните реальные ключи
docker compose up -d --build
docker compose exec app npx prisma migrate deploy
docker compose exec app npx tsx prisma/seed.ts
docker compose exec app npx tsx prisma/make-admin.ts you@example.com
```

Приложение поднимется на порту 3000, Postgres — на 5432 (том `db_data`
сохраняет данные между перезапусками). `docker-compose.yml` уже содержит
healthcheck, поэтому `app` не стартует раньше, чем БД готова к соединениям.

## Вариант 2 — Vercel/любой Node-хостинг + managed Postgres

1. Поднимите Postgres (Neon, Supabase, RDS, Timescale — любой провайдер с
   connection string).
2. В переменных окружения хостинга задайте всё из `.env.example`,
   особенно `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (реальный домен).
3. `npm run build` уже включает `prisma generate` в `postinstall` — ничего
   дополнительно настраивать не нужно.
4. После первого деплоя — миграции и сид через CLI хостинга или локально,
   указав продовый `DATABASE_URL`:
   ```bash
   npx prisma migrate deploy
   npx tsx prisma/seed.ts
   npx tsx prisma/make-admin.ts you@example.com
   ```

## Чек-лист перед реальным трафиком

- [ ] `NEXTAUTH_SECRET` — сгенерирован заново (`openssl rand -base64 32`),
      не тот, что в `.env.example`
- [ ] `LAVA_API_KEY` / `LAVA_SHOP_ID` / `LAVA_OFFER_ID_*` — реальные, поле
      `returnUrl` в `lib/payments/lava.ts` сверено с актуальной документацией
      Lava.top (см. предупреждение в файле)
- [ ] `LAVA_WEBHOOK_SECRET` задан и совпадает с настройками в кабинете Lava.top
- [ ] Вебхук Lava.top указывает на `https://<домен>/api/webhook/lava`
- [ ] `RESEND_API_KEY` (или другой email-провайдер, см. `lib/email/send.ts`)
- [ ] Telegram-бот создан, `TELEGRAM_BOT_TOKEN`/`TELEGRAM_BOT_USERNAME`
      заданы, вебхук зарегистрирован (см. `docs/telegram-onboarding.md`)
- [ ] Хотя бы один пользователь повышен до `ADMIN`
      (`npx tsx prisma/make-admin.ts you@example.com`)
- [ ] Реальные фото по промптам из `docs/creative-prompts.md`
- [ ] `/offer` и `/privacy` — реквизиты и текст согласованы с юристом
- [ ] Резервное копирование БД настроено на стороне хостинга Postgres
- [ ] `NEXTAUTH_URL` начинается с `https://` — сессионная cookie получает
      флаг `Secure` автоматически (Auth.js сравнивает протокол этого URL),
      `HttpOnly` и `SameSite=Lax` включены всегда по умолчанию. На `http://`
      (только для локальной разработки) `Secure` осознанно выключается —
      иначе браузер отбросит cookie

## Масштабирование каталога

Продукты/модули/уроки/тарифы — не хардкод, а таблицы `Product`/`Module`/`Lesson`/`Tariff`
в Postgres (см. `prisma/schema.prisma`). Новый курс, электронная книга,
шаблон или membership создаётся прямо в браузере: `/admin/products` →
«Новый продукт» → добавьте тарифы и модули с уроками на странице продукта.
Правка кода не требуется. `npm run db:studio` (Prisma Studio) остаётся
доступным для массовых правок и сидинга (`prisma/seed.ts`), но для
повседневной работы предназначен визуальный admin-интерфейс.

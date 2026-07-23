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
- [ ] `CRON_SECRET` задан, расписание из раздела «Scheduled jobs» подключено
- [ ] `NEXTAUTH_URL` начинается с `https://` — сессионная cookie получает
      флаг `Secure` автоматически (Auth.js сравнивает протокол этого URL),
      `HttpOnly` и `SameSite=Lax` включены всегда по умолчанию. На `http://`
      (только для локальной разработки) `Secure` осознанно выключается —
      иначе браузер отбросит cookie

## Scheduled jobs

Три email-автоматизации существуют как обычные API-роуты, а не
встроенные крон-джобы (в serverless/Docker-окружении нет persistent
процесса для `setInterval`) — их должен дёргать внешний планировщик:

| Роут | Частота | Что делает |
|---|---|---|
| `POST /api/cron/abandoned-cart` | каждый час | Письмо тем, кто начал оформление, но не оплатил (1-48 часов назад) |
| `POST /api/cron/onboarding-drip` | раз в день | Письма на 1/3/7 день после покупки |
| `POST /api/cron/reactivation` | раз в неделю | Письмо клиентам без активности 14+ дней |
| `POST /api/cron/upsell-nudge` | раз в день | Предложение апгрейда с «Базового» на 5-6 день после покупки |

Все три требуют заголовок `Authorization: Bearer <CRON_SECRET>` —
задайте `CRON_SECRET` в `.env` (без него роуты отказывают в проде и
разрешают в dev/staging для локального тестирования).

**Вариант А — системный crontab** (Docker/VPS):
```bash
0 * * * *   curl -s -X POST -H "Authorization: Bearer $CRON_SECRET" https://<домен>/api/cron/abandoned-cart
0 9 * * *   curl -s -X POST -H "Authorization: Bearer $CRON_SECRET" https://<домен>/api/cron/onboarding-drip
0 9 * * 1   curl -s -X POST -H "Authorization: Bearer $CRON_SECRET" https://<домен>/api/cron/reactivation
30 9 * * *  curl -s -X POST -H "Authorization: Bearer $CRON_SECRET" https://<домен>/api/cron/upsell-nudge
```

**Вариант Б — Vercel Cron** (`vercel.json`):
```json
{
  "crons": [
    { "path": "/api/cron/abandoned-cart", "schedule": "0 * * * *" },
    { "path": "/api/cron/onboarding-drip", "schedule": "0 9 * * *" },
    { "path": "/api/cron/reactivation", "schedule": "0 9 * * 1" },
    { "path": "/api/cron/upsell-nudge", "schedule": "30 9 * * *" }
  ]
}
```
Vercel Cron вызывает роуты с внутренней авторизацией — дополнительно
задайте `CRON_SECRET` и в Vercel, и сверяйте его в `Authorization`
заголовке (Vercel добавляет его автоматически при использовании их
Cron, либо настройте вручную через `vercel.json` → `headers`).

Каждый роут идемпотентен: письмо не отправится дважды одному и тому же
заказу/пользователю — статус хранится в `OrderEvent` (см. код роутов в
`src/app/api/cron/`).

## Backup и восстановление

**Что бэкапить:** только Postgres — вся продуктовая логика (каталог,
заказы, пользователи, прогресс) живёт в БД. Загруженные PDF в
`product/pdf/` версионируются в git, не нуждаются в отдельном бэкапе.

**Вариант 1 — Docker Compose:**
```bash
# Бэкап (можно по крону, например ежедневно в 3:00)
docker compose exec -T db pg_dump -U domdesertov domdesertov | gzip > backup-$(date +%F).sql.gz

# Восстановление на новом окружении
gunzip -c backup-2026-01-01.sql.gz | docker compose exec -T db psql -U domdesertov domdesertov
```
Храните бэкапы вне контейнера/сервера (S3-совместимое хранилище,
отдельный диск) — том `db_data` не защищает от потери всего сервера.

**Вариант 2 — managed Postgres (Neon/Supabase/RDS):** используйте
встроенные point-in-time recovery и автоматические снапшоты провайдера
— это надёжнее самодельных дампов. Просто убедитесь, что PITR/снапшоты
включены и период хранения покрывает ваши требования (обычно 7-30 дней).

**Проверка восстановления:** периодически (не реже раза в квартал)
разворачивайте последний бэкап в чистое окружение и прогоняйте
`npx prisma migrate deploy` + смоук-тест логина — бэкап, который ни разу
не восстанавливали, нельзя считать рабочим.

## Масштабирование каталога

Продукты/модули/уроки/тарифы — не хардкод, а таблицы `Product`/`Module`/`Lesson`/`Tariff`
в Postgres (см. `prisma/schema.prisma`). Новый курс, электронная книга,
шаблон или membership создаётся прямо в браузере: `/admin/products` →
«Новый продукт» → добавьте тарифы и модули с уроками на странице продукта.
Правка кода не требуется. `npm run db:studio` (Prisma Studio) остаётся
доступным для массовых правок и сидинга (`prisma/seed.ts`), но для
повседневной работы предназначен визуальный admin-интерфейс.

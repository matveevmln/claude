export const site = {
  brand: "Дом Десертов",
  productName: "Большая Домашняя Кондитерская",
  productTagline: "От первого бисквита до тортов на заказ",
  /**
   * Slug of the Product this landing page/checkout sells. The platform is
   * multi-product at the data/admin layer (see /admin/products) — any
   * number of products can exist in the DB — but this specific landing
   * page and its checkout form are built for one product. A second
   * product needs its own landing page (reusing these components) that
   * posts its own productSlug/tariffId to /api/checkout.
   */
  primaryProductSlug: "big-home-patisserie",
  domain: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dom-desertov.ru",
  supportTelegram: process.env.NEXT_PUBLIC_SUPPORT_TG ?? "https://t.me/dom_desertov_support",
  channelTelegram: process.env.NEXT_PUBLIC_CHANNEL_TG ?? "https://t.me/dom_desertov",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "hello@dom-desertov.ru",
  currency: "RUB",
  author: {
    name: "Марина Соколова",
    role: "Кондитер-практик, основательница «Дом Десертов»",
    bio:
      "12 лет пекла для семьи и на заказ у себя дома. Прошла путь от первого кривого бисквита до очереди из клиентов на 2 месяца вперёд. Учит так, как объясняла бы дочери или подруге — без сложных терминов, только то, что реально работает на домашней кухне.",
  },
  analytics: {
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
    gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
    gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
    yandexMetrikaId: process.env.NEXT_PUBLIC_YM_ID ?? "",
    tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? "",
    hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID ?? "",
    clarityId: process.env.NEXT_PUBLIC_CLARITY_ID ?? "",
  },
} as const;

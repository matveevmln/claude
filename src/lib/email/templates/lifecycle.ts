import { emailLayout, emailButton } from "@/lib/email/layout";
import { site } from "@/config/site";
import { escapeHtml } from "@/lib/security";

export function onboardingDripEmail({ name, day, title, message, ctaUrl, ctaLabel }: {
  name: string;
  day: number;
  title: string;
  message: string;
  ctaUrl: string;
  ctaLabel: string;
}) {
  const safeName = escapeHtml(name);
  const bodyHtml = `
    <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#A52C50;margin:0 0 8px;">День ${day}</p>
    <h1 style="font-size:22px;color:#2B1B24;margin:0 0 12px;">${escapeHtml(title)}</h1>
    <p style="font-size:15px;line-height:1.6;color:#6B4F5C;margin:0 0 20px;">${safeName ? `${safeName}, ` : ""}${escapeHtml(message)}</p>
    <div style="text-align:center;">${emailButton(ctaUrl, ctaLabel)}</div>
  `;
  return {
    subject: title,
    html: emailLayout({ bodyHtml }),
    text: `${title}\n\n${message}\n\n${ctaLabel}: ${ctaUrl}`,
  };
}

export function abandonedCheckoutEmail({ name, tariffName, checkoutUrl }: {
  name: string;
  tariffName: string;
  checkoutUrl: string;
}) {
  const safeName = escapeHtml(name);
  const bodyHtml = `
    <h1 style="font-size:22px;color:#2B1B24;margin:0 0 12px;">Вы почти у цели!</h1>
    <p style="font-size:15px;line-height:1.6;color:#6B4F5C;margin:0 0 20px;">
      ${safeName ? `${safeName}, вы` : "Вы"} начали оформлять тариф «${escapeHtml(tariffName)}», но не завершили оплату.
      Место всё ещё за вами — вернитесь и заберите свой доступ.
    </p>
    <div style="text-align:center;">${emailButton(checkoutUrl, "Завершить оформление")}</div>
  `;
  return {
    subject: "Вы забыли завершить оформление курса",
    html: emailLayout({ bodyHtml }),
    text: `${name}, вы начали оформлять тариф «${tariffName}», но не завершили оплату. Завершить: ${checkoutUrl}`,
  };
}

export function upsellEmail({ name, offerTitle, offerDescription, ctaUrl }: {
  name: string;
  offerTitle: string;
  offerDescription: string;
  ctaUrl: string;
}) {
  const safeName = escapeHtml(name);
  const bodyHtml = `
    <h1 style="font-size:22px;color:#2B1B24;margin:0 0 12px;">${escapeHtml(offerTitle)}</h1>
    <p style="font-size:15px;line-height:1.6;color:#6B4F5C;margin:0 0 20px;">${safeName ? `${safeName}, ` : ""}${escapeHtml(offerDescription)}</p>
    <div style="text-align:center;">${emailButton(ctaUrl, "Посмотреть предложение")}</div>
  `;
  return {
    subject: offerTitle,
    html: emailLayout({ bodyHtml }),
    text: `${offerTitle}\n\n${offerDescription}\n\n${ctaUrl}`,
  };
}

export function reactivationEmail({ name, loginUrl }: { name: string; loginUrl: string }) {
  const safeName = escapeHtml(name);
  const bodyHtml = `
    <h1 style="font-size:22px;color:#2B1B24;margin:0 0 12px;">Мы скучаем по вам!</h1>
    <p style="font-size:15px;line-height:1.6;color:#6B4F5C;margin:0 0 20px;">
      ${safeName ? `${safeName}, ` : ""}курс всё ещё ждёт вас — модули никуда не делись, доступ навсегда.
      Возвращайтесь и допеките то, что начали.
    </p>
    <div style="text-align:center;">${emailButton(loginUrl, "Вернуться в кабинет")}</div>
  `;
  return {
    subject: `Продолжите обучение — ${site.brand}`,
    html: emailLayout({ bodyHtml }),
    text: `${name}, курс всё ещё ждёт вас. Личный кабинет: ${loginUrl}`,
  };
}

export function referralEmail({ name, referralUrl, commissionPercent }: {
  name: string;
  referralUrl: string;
  commissionPercent: number;
}) {
  const safeName = escapeHtml(name);
  const bodyHtml = `
    <h1 style="font-size:22px;color:#2B1B24;margin:0 0 12px;">Зарабатывайте, рекомендуя курс</h1>
    <p style="font-size:15px;line-height:1.6;color:#6B4F5C;margin:0 0 20px;">
      ${safeName ? `${safeName}, ` : ""}делитесь своей персональной ссылкой и получайте ${commissionPercent}% с каждой продажи.
    </p>
    <p style="font-size:14px;word-break:break-all;color:#2B1B24;background:#FBEAE3;border-radius:12px;padding:12px 16px;margin:0 0 20px;">${escapeHtml(referralUrl)}</p>
    <div style="text-align:center;">${emailButton(referralUrl, "Скопировать ссылку")}</div>
  `;
  return {
    subject: `Ваша партнёрская ссылка — ${site.brand}`,
    html: emailLayout({ bodyHtml }),
    text: `Ваша партнёрская ссылка (комиссия ${commissionPercent}%): ${referralUrl}`,
  };
}

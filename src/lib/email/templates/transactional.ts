import { emailLayout, emailButton } from "@/lib/email/layout";
import { site } from "@/config/site";
import { buildTelegramDeepLink } from "@/lib/telegram";
import { escapeHtml } from "@/lib/security";

export function welcomeEmail({
  name,
  email,
  tempPassword,
  tariffName,
  orderId,
}: {
  name: string;
  email: string;
  tempPassword: string;
  tariffName: string;
  orderId: string;
}) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const loginUrl = `${site.domain}/login`;
  const tgUrl = buildTelegramDeepLink(orderId);
  const bodyHtml = `
    <h1 style="font-size:22px;color:#2B1B24;margin:0 0 12px;">Добро пожаловать, ${safeName}!</h1>
    <p style="font-size:15px;line-height:1.6;color:#6B4F5C;margin:0 0 16px;">
      Ваш тариф «${escapeHtml(tariffName)}» открыт. Личный кабинет уже ждёт:
    </p>
    <p style="font-size:14px;line-height:1.6;color:#2B1B24;margin:0 0 4px;">Email: <strong>${safeEmail}</strong></p>
    <p style="font-size:14px;line-height:1.6;color:#2B1B24;margin:0 0 20px;">Временный пароль: <strong>${escapeHtml(tempPassword)}</strong></p>
    <div style="text-align:center;margin-bottom:16px;">
      ${emailButton(loginUrl, "Войти в личный кабинет")}
    </div>
    <p style="font-size:13px;line-height:1.6;color:#6B4F5C;margin:0 0 8px;">
      Не забудьте присоединиться к закрытому чату учениц в Telegram:
    </p>
    <div style="text-align:center;">
      ${emailButton(tgUrl, "Открыть Telegram")}
    </div>
  `;
  return {
    subject: `Добро пожаловать в «${site.brand}»!`,
    html: emailLayout({ bodyHtml, preheader: "Ваш личный кабинет уже открыт" }),
    text: `Добро пожаловать, ${name}!\nEmail: ${email}\nВременный пароль: ${tempPassword}\nЛичный кабинет: ${loginUrl}\nTelegram-чат: ${tgUrl}`,
  };
}

export function accessGrantedEmail({ name, tariffName }: { name: string; tariffName: string }) {
  const safeName = escapeHtml(name);
  const loginUrl = `${site.domain}/login`;
  const bodyHtml = `
    <h1 style="font-size:22px;color:#2B1B24;margin:0 0 12px;">Новый тариф открыт!</h1>
    <p style="font-size:15px;line-height:1.6;color:#6B4F5C;margin:0 0 20px;">
      ${safeName}, тариф «${escapeHtml(tariffName)}» уже доступен в вашем личном кабинете.
    </p>
    <div style="text-align:center;">
      ${emailButton(loginUrl, "Перейти в кабинет")}
    </div>
  `;
  return {
    subject: `Тариф «${tariffName}» открыт — ${site.brand}`,
    html: emailLayout({ bodyHtml }),
    text: `${name}, тариф «${tariffName}» открыт. Личный кабинет: ${loginUrl}`,
  };
}

export function receiptEmail({
  name,
  tariffName,
  amount,
  orderId,
  paidAt,
}: {
  name: string;
  tariffName: string;
  amount: number;
  orderId: string;
  paidAt: Date;
}) {
  const safeName = escapeHtml(name);
  const bodyHtml = `
    <h1 style="font-size:22px;color:#2B1B24;margin:0 0 12px;">Чек об оплате</h1>
    <p style="font-size:15px;line-height:1.6;color:#6B4F5C;margin:0 0 16px;">Спасибо за покупку, ${safeName}!</p>
    <table style="width:100%;font-size:14px;color:#2B1B24;">
      <tr><td style="padding:6px 0;color:#6B4F5C;">Заказ</td><td style="padding:6px 0;text-align:right;">${escapeHtml(orderId)}</td></tr>
      <tr><td style="padding:6px 0;color:#6B4F5C;">Тариф</td><td style="padding:6px 0;text-align:right;">${escapeHtml(tariffName)}</td></tr>
      <tr><td style="padding:6px 0;color:#6B4F5C;">Сумма</td><td style="padding:6px 0;text-align:right;font-weight:700;">${amount.toLocaleString("ru-RU")} ₽</td></tr>
      <tr><td style="padding:6px 0;color:#6B4F5C;">Дата</td><td style="padding:6px 0;text-align:right;">${paidAt.toLocaleDateString("ru-RU")}</td></tr>
    </table>
  `;
  return {
    subject: `Чек об оплате — ${site.brand}`,
    html: emailLayout({ bodyHtml }),
    text: `Чек об оплате\nЗаказ: ${orderId}\nТариф: ${tariffName}\nСумма: ${amount} ₽\nДата: ${paidAt.toLocaleDateString("ru-RU")}`,
  };
}

export function manualPasswordResetEmail({ name, tempPassword }: { name: string; tempPassword: string }) {
  const safeName = escapeHtml(name);
  const bodyHtml = `
    <h1 style="font-size:22px;color:#2B1B24;margin:0 0 12px;">Новый пароль от аккаунта</h1>
    <p style="font-size:15px;line-height:1.6;color:#6B4F5C;margin:0 0 20px;">
      ${safeName ? `${safeName}, служба` : "Служба"} поддержки сбросила ваш пароль по запросу. Новый временный пароль:
    </p>
    <p style="font-size:20px;font-weight:800;letter-spacing:1px;color:#2B1B24;background:#FBEAE3;border-radius:12px;padding:14px 18px;text-align:center;margin:0 0 20px;">
      ${escapeHtml(tempPassword)}
    </p>
    <p style="font-size:14px;line-height:1.6;color:#6B4F5C;margin:0;">
      Рекомендуем сменить его на свой в личном кабинете сразу после входа.
    </p>
  `;
  return {
    subject: `Новый пароль — ${site.brand}`,
    html: emailLayout({ bodyHtml }),
    text: `Новый временный пароль: ${tempPassword}\nРекомендуем сменить его в личном кабинете после входа.`,
  };
}

export function adminMessageEmail({ name, subject, message }: { name: string; subject: string; message: string }) {
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const bodyHtml = `
    <h1 style="font-size:22px;color:#2B1B24;margin:0 0 12px;">${escapeHtml(subject)}</h1>
    <p style="font-size:15px;line-height:1.6;color:#6B4F5C;margin:0 0 8px;">${safeName ? `${safeName},` : ""}</p>
    <p style="font-size:15px;line-height:1.6;color:#6B4F5C;margin:0;">${safeMessage}</p>
  `;
  return {
    subject,
    html: emailLayout({ bodyHtml }),
    text: message,
  };
}

export function passwordResetEmail({ name, resetUrl }: { name: string; resetUrl: string }) {
  const safeName = escapeHtml(name);
  const bodyHtml = `
    <h1 style="font-size:22px;color:#2B1B24;margin:0 0 12px;">Восстановление пароля</h1>
    <p style="font-size:15px;line-height:1.6;color:#6B4F5C;margin:0 0 20px;">
      ${safeName ? `${safeName}, мы` : "Мы"} получили запрос на сброс пароля. Ссылка действует 1 час.
      Если это были не вы — просто проигнорируйте это письмо.
    </p>
    <div style="text-align:center;margin-bottom:8px;">
      ${emailButton(resetUrl, "Сбросить пароль")}
    </div>
  `;
  return {
    subject: `Восстановление пароля — ${site.brand}`,
    html: emailLayout({ bodyHtml }),
    text: `Восстановление пароля. Ссылка (действует 1 час): ${resetUrl}`,
  };
}

import { site } from "@/config/site";

/** Email-safe layout: inline styles only, table-free but simple enough for major clients. */
export function emailLayout({ preheader, bodyHtml }: { preheader?: string; bodyHtml: string }) {
  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;background:#FFF8F6;font-family:Helvetica,Arial,sans-serif;">
    ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>` : ""}
    <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
      <div style="text-align:center;margin-bottom:24px;">
        <span style="font-size:20px;font-weight:800;color:#2B1B24;">${site.brand}</span>
      </div>
      <div style="background:#FFFFFF;border:1px solid #EED0C8;border-radius:24px;padding:32px 28px;">
        ${bodyHtml}
      </div>
      <div style="text-align:center;margin-top:20px;font-size:12px;color:#6B4F5C;">
        <p style="margin:0 0 6px;">${site.brand} · <a href="mailto:${site.supportEmail}" style="color:#6B4F5C;">${site.supportEmail}</a></p>
        <p style="margin:0;">
          <a href="${site.domain}/privacy" style="color:#6B4F5C;">Политика конфиденциальности</a>
        </p>
      </div>
    </div>
  </body>
</html>`;
}

export function emailButton(url: string, label: string) {
  return `<a href="${url}" style="display:inline-block;background:linear-gradient(90deg,#C13E63,#A52C50);color:#FFFFFF;text-decoration:none;font-weight:700;font-size:15px;padding:14px 28px;border-radius:999px;">${label}</a>`;
}

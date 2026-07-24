import { Container } from "@/components/ui/Container";
import { site } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-beige-line/60 py-10">
      <Container className="flex flex-col items-center gap-4 text-center text-xs text-choco-soft/70 sm:flex-row sm:justify-between sm:text-left">
        <p>
          © {new Date().getFullYear()} {site.brand}. Все права защищены.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <a href={site.channelTelegram} className="hover:text-gold-deep">
            Telegram-канал
          </a>
          <a href={site.supportTelegram} className="hover:text-gold-deep">
            Поддержка
          </a>
          <a href={`mailto:${site.supportEmail}`} className="hover:text-gold-deep">
            {site.supportEmail}
          </a>
          <a href="/offer" className="hover:text-gold-deep">
            Публичная оферта
          </a>
          <a href="/privacy" className="hover:text-gold-deep">
            Политика конфиденциальности
          </a>
        </div>
      </Container>
    </footer>
  );
}

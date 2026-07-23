import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { site } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-beige-line bg-white/60 py-10">
      <Container className="flex flex-col items-center gap-4 text-center text-xs text-choco-soft sm:flex-row sm:justify-between sm:text-left">
        <p>
          © {new Date().getFullYear()} {site.brand}. Все права защищены.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/offer" className="hover:text-berry-deep">Оферта</Link>
          <Link href="/privacy" className="hover:text-berry-deep">Конфиденциальность</Link>
          <a href={`mailto:${site.supportEmail}`} className="hover:text-berry-deep">{site.supportEmail}</a>
          <a href={site.supportTelegram} className="hover:text-berry-deep">Telegram-поддержка</a>
        </div>
      </Container>
    </footer>
  );
}

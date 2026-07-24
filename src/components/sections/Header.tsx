"use client";

import { site } from "@/config/site";
import { useCheckout } from "@/components/CheckoutProvider";
import { CakeGlyph } from "@/components/ui/Ornaments";

const navLinks = [
  { href: "#program", label: "Программа" },
  { href: "#testimonials", label: "Отзывы" },
  { href: "#pricing", label: "Тарифы" },
  { href: "#faq", label: "Вопросы" },
];

export function Header() {
  const openCheckout = useCheckout();

  return (
    <header className="sticky top-0 z-40 border-b border-beige-line/60 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <a href="#main-content" className="flex items-center gap-2">
          <CakeGlyph className="h-6 w-6 text-berry" />
          <span className="font-display text-lg font-bold text-choco">{site.brand}</span>
        </a>

        <nav aria-label="Основная навигация" className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-choco-soft transition hover:text-berry"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          onClick={() => openCheckout("standard")}
          className="rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-4 py-2 text-xs font-bold text-white shadow-[0_6px_16px_-6px_rgba(161,44,80,0.55)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-berry-deep focus-visible:ring-offset-2 sm:px-5 sm:py-2.5 sm:text-sm"
        >
          Забрать курс
        </button>
      </div>
    </header>
  );
}

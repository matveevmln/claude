"use client";

import Link from "next/link";
import { site } from "@/config/site";
import { CakeGlyph } from "@/components/ui/Ornaments";
import { useCheckout } from "@/components/CheckoutProvider";

export function Header() {
  const { openCheckout } = useCheckout();

  return (
    <header className="sticky top-0 z-40 border-b border-beige-line/60 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <CakeGlyph className="h-6 w-6 text-berry" />
          <span className="font-display text-lg font-bold text-choco">{site.brand}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-choco-soft sm:flex">
          <a href="#program" className="hover:text-berry-deep">Программа</a>
          <a href="#testimonials" className="hover:text-berry-deep">Отзывы</a>
          <a href="#pricing" className="hover:text-berry-deep">Тарифы</a>
          <a href="#faq" className="hover:text-berry-deep">Вопросы</a>
        </nav>
        <button
          onClick={() => openCheckout("standard")}
          className="rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
        >
          Начать учиться
        </button>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { site } from "@/config/site";

const navItems = [
  { href: "/admin", label: "Обзор" },
  { href: "/admin/orders", label: "Заказы" },
  { href: "/admin/customers", label: "Клиенты" },
  { href: "/admin/products", label: "Продукты" },
  { href: "/admin/announcements", label: "Объявления" },
  { href: "/admin/coupons", label: "Купоны" },
  { href: "/admin/access", label: "Доступ вручную" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 border-b border-beige-line/60 bg-choco">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/admin" className="font-display text-lg font-bold text-cream">
            {site.brand} · Admin
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-full border border-cream/30 px-4 py-2 text-xs font-semibold text-cream transition hover:bg-cream/10"
          >
            Выйти
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-5 py-8 sm:px-8">
        <nav aria-label="Навигация админ-панели" className="hidden w-52 shrink-0 flex-col gap-1 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  active ? "bg-white text-berry-deep shadow-sm" : "text-choco-soft hover:bg-white/60"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

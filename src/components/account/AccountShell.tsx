"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { site } from "@/config/site";
import { CakeGlyph } from "@/components/ui/Ornaments";

const navItems = [
  { href: "/account", label: "Дашборд", icon: "🏠" },
  { href: "/account/course", label: "Курс", icon: "🎓" },
  { href: "/account/downloads", label: "Загрузки", icon: "📥" },
  { href: "/account/profile", label: "Профиль", icon: "👤" },
];

export function AccountShell({
  children,
  impersonating,
}: {
  children: React.ReactNode;
  impersonating?: { name: string | null; email: string } | null;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function stopImpersonating() {
    await fetch("/api/admin/impersonate/stop", { method: "POST" });
    router.push("/admin/customers");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream">
      {impersonating && (
        <div className="flex items-center justify-between gap-3 bg-choco px-5 py-2.5 text-xs text-white sm:px-8">
          <span>
            Вы смотрите личный кабинет как <strong>{impersonating.name ?? impersonating.email}</strong> ({impersonating.email})
          </span>
          <button
            onClick={stopImpersonating}
            className="shrink-0 rounded-full border border-white/30 px-3 py-1.5 font-semibold transition hover:bg-white/10"
          >
            Вернуться в админку
          </button>
        </div>
      )}
      <header className="sticky top-0 z-30 border-b border-beige-line/60 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/account" className="flex items-center gap-2">
            <CakeGlyph className="h-6 w-6 text-berry" />
            <span className="font-display text-lg font-bold text-choco">{site.brand}</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-full border border-beige-line px-4 py-2 text-xs font-semibold text-choco-soft transition hover:bg-white"
          >
            Выйти
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-5 py-8 sm:px-8">
        <nav
          aria-label="Навигация личного кабинета"
          className="hidden w-52 shrink-0 flex-col gap-1 lg:flex"
        >
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  active ? "bg-white text-berry-deep shadow-sm" : "text-choco-soft hover:bg-white/60"
                }`}
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="min-w-0 flex-1 pb-24 lg:pb-0">{children}</main>
      </div>

      <nav
        aria-label="Навигация личного кабинета"
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-beige-line bg-white/95 backdrop-blur-md lg:hidden"
      >
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                active ? "text-berry-deep" : "text-choco-soft"
              }`}
            >
              <span aria-hidden className="text-lg">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

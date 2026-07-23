"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Countdown } from "@/components/ui/Countdown";
import { tariffs } from "@/lib/content/product";
import { useCheckout } from "@/components/CheckoutProvider";

export function Pricing() {
  const { openCheckout } = useCheckout();

  return (
    <section id="pricing" className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Тарифы"
          title="Выберите свой уровень погружения"
          subtitle="Все тарифы — с доступом навсегда и гарантией возврата 14 дней."
        />

        <div className="mt-6 flex justify-center">
          <Countdown />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {tariffs.map((t, i) => {
            const highlighted = t.id === "standard";
            return (
              <Reveal key={t.id} delay={i * 0.08}>
                <div
                  className={`relative flex h-full flex-col rounded-[2rem] border p-7 ${
                    highlighted
                      ? "border-berry-deep bg-white shadow-[0_24px_48px_-24px_rgba(197,62,99,0.35)]"
                      : "border-beige-line bg-white/60"
                  }`}
                >
                  {t.badge && (
                    <span
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold text-white ${
                        highlighted ? "bg-berry-deep" : "bg-choco"
                      }`}
                    >
                      {t.badge}
                    </span>
                  )}
                  <p className="font-display text-xl font-bold text-choco">{t.name}</p>
                  <p className="mt-1 text-sm text-choco-soft">{t.description}</p>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-display text-3xl font-extrabold text-choco">
                      {t.price.toLocaleString("ru-RU")} ₽
                    </span>
                    <span className="text-sm text-choco-soft/70 line-through">
                      {t.oldPrice.toLocaleString("ru-RU")} ₽
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blush px-3 py-1 text-xs font-semibold text-berry-deep">
                      Экономия {(t.oldPrice - t.price).toLocaleString("ru-RU")} ₽
                    </span>
                    <span className="text-xs text-choco-soft">
                      ≈ {Math.round(t.price / 40)} ₽ за урок
                    </span>
                  </div>

                  <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                    {t.features.map((f) => (
                      <li key={f} className="flex gap-2 text-sm text-choco-soft">
                        <span aria-hidden className="text-berry-deep">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => openCheckout(t.id)}
                    className={`mt-7 inline-flex items-center justify-center rounded-full px-6 py-4 text-sm font-bold transition hover:-translate-y-0.5 ${
                      highlighted
                        ? "bg-gradient-to-r from-berry-deep to-berry-strong text-white"
                        : "bg-choco text-cream"
                    }`}
                  >
                    Выбрать «{t.name}»
                  </button>
                  <p className="mt-3 text-center text-[11px] text-choco-soft">
                    🔒 Безопасная оплата · Гарантия 14 дней
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

"use client";

import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Countdown } from "@/components/ui/Countdown";
import { tariffs } from "@/lib/content/product";
import { useCheckout } from "@/components/CheckoutProvider";

export function Pricing() {
  const openCheckout = useCheckout();

  return (
    <section id="pricing" className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Тарифы"
          title="Выберите свой уровень погружения"
          subtitle="Все тарифы — с доступом навсегда и гарантией возврата 14 дней."
        />

        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-3 rounded-2xl border border-blush-deep/50 bg-white/70 px-4 py-2.5">
            <span className="text-xs font-medium text-choco-soft">Цена запуска закончится через:</span>
            <Countdown />
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {tariffs.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.06}>
              <div
                className={clsx(
                  "relative flex h-full flex-col rounded-[2rem] border p-7",
                  t.highlighted
                    ? "border-berry/60 bg-gradient-to-b from-white to-blush/40 shadow-[0_24px_54px_-20px_rgba(232,87,123,0.45)] lg:-translate-y-3"
                    : "border-beige-line bg-white/50"
                )}
              >
                {t.badge && (
                  <span
                    className={clsx(
                      "absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold",
                      t.highlighted
                        ? "bg-gradient-to-r from-berry-deep to-berry-strong text-white"
                        : "bg-beige text-choco"
                    )}
                  >
                    {t.badge}
                  </span>
                )}

                <h3 className="font-display text-2xl font-bold text-choco">{t.name}</h3>
                <p className="mt-1 text-sm text-choco-soft">{t.description}</p>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-extrabold text-choco">
                    {t.price.toLocaleString("ru-RU")} ₽
                  </span>
                  <span className="text-sm text-choco-soft/60 line-through">
                    {t.oldPrice.toLocaleString("ru-RU")} ₽
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="rounded-full bg-blush/70 px-2.5 py-0.5 text-[11px] font-bold text-berry-deep">
                    Экономия {(t.oldPrice - t.price).toLocaleString("ru-RU")} ₽
                  </span>
                  <span className="text-[11px] text-choco-soft/70">
                    ≈ {Math.round(t.price / 40).toLocaleString("ru-RU")} ₽ за урок
                  </span>
                </div>
                {t.id === "vip" && (
                  <p className="mt-2 text-[11px] font-medium text-gold-deep">
                    ⚠ Мини-группа: не больше 20 учениц на поток
                  </p>
                )}

                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-choco-soft">
                      <span className="mt-0.5 shrink-0 text-berry">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  variant={t.highlighted ? "primary" : "secondary"}
                  className="mt-7 w-full"
                  onClick={() => openCheckout(t.id)}
                >
                  Выбрать «{t.name}»
                </Button>
                <p className="mt-3 text-center text-[11px] text-choco-soft/60">
                  🔒 Безопасная оплата · Гарантия 14 дней
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

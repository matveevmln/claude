"use client";

import { Container } from "@/components/ui/Container";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Countdown } from "@/components/ui/Countdown";
import { useCheckout } from "@/components/CheckoutProvider";

export function Hero() {
  const { openCheckout } = useCheckout();

  return (
    <section className="overflow-hidden bg-gradient-to-b from-blush/40 via-cream to-cream py-16 sm:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="inline-flex rounded-full border border-beige-line bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-berry-deep">
            Онлайн-программа для дома · 8 модулей
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] text-choco sm:text-5xl">
            Пеките торты,{" "}
            <span className="rose-gradient-text">за которые не стыдно</span> просить деньги
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-choco-soft">
            Пошаговая домашняя кондитерская: видеоуроки, точные граммовки и техкарты, которые превращают
            «получилось криво» в «а можно у вас заказать торт?».
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span aria-hidden className="tracking-tight text-berry-deep">
              ★★★★★
            </span>
            <span className="font-semibold text-choco">4.9 из 500+ учениц</span>
            <span className="text-choco-soft">·</span>
            <span className="rounded-full bg-blush/70 px-3 py-1 text-xs font-semibold text-berry-deep">
              Без опыта — с нуля
            </span>
          </div>

          <div className="mt-7 flex flex-col gap-4">
            <button
              onClick={() => openCheckout("standard")}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-8 py-4 text-base font-bold text-white transition hover:-translate-y-0.5"
            >
              Начать печь красиво →
            </button>

            <Countdown variant="card" />

            <p className="text-xs text-choco-soft">
              Оплата картой · доступ навсегда · гарантия возврата 14 дней
            </p>
          </div>

          <div className="mt-8 grid max-w-sm grid-cols-2 gap-4">
            <div className="rounded-2xl border border-beige-line bg-white/60 p-4">
              <p className="font-display text-2xl font-extrabold text-berry-deep">500+</p>
              <p className="text-xs text-choco-soft">учениц уже внутри</p>
            </div>
            <div className="rounded-2xl border border-beige-line bg-white/60 p-4">
              <p className="font-display text-2xl font-extrabold text-berry-deep">4.9★</p>
              <p className="text-xs text-choco-soft">средняя оценка курса</p>
            </div>
          </div>
        </div>
        <PhotoSlot slotId="hero-cake" ratio="aspect-[4/5]" label="Фото готового торта на кухонном столе" />
      </Container>
    </section>
  );
}

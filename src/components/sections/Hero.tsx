"use client";

import { Container } from "@/components/ui/Container";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { useCheckout } from "@/components/CheckoutProvider";

export function Hero() {
  const { openCheckout } = useCheckout();

  return (
    <section className="overflow-hidden bg-gradient-to-b from-blush/40 via-cream to-cream py-16 sm:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="inline-flex rounded-full border border-beige-line bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-berry-deep">
            Онлайн-курс для дома
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] text-choco sm:text-5xl">
            Пеките торты,{" "}
            <span className="rose-gradient-text">за которые не стыдно</span> просить деньги!
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-choco-soft">
            Пошаговая домашняя кондитерская академия: точные граммовки, техники и история превращения
            «кривого бисквита» в очередь из клиентов на 2 месяца вперёд.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button
              onClick={() => openCheckout("standard")}
              className="rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-8 py-4 text-base font-bold text-white transition hover:-translate-y-0.5"
            >
              Начать печь красиво
            </button>
            <div className="flex items-center gap-1 text-sm font-semibold text-choco">
              4.9★ <span className="font-normal text-choco-soft">· 500+ учениц</span>
            </div>
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

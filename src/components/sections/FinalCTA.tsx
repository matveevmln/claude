"use client";

import { Container } from "@/components/ui/Container";
import { useCheckout } from "@/components/CheckoutProvider";

export function FinalCTA() {
  const { openCheckout } = useCheckout();

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="rounded-[2.5rem] bg-gradient-to-br from-choco to-[#3d2530] p-10 text-center sm:p-16">
          <h2 className="font-display text-2xl font-extrabold text-cream sm:text-3xl">
            Начните печь красиво уже на этой неделе
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-cream/70">
            500+ учениц уже прошли путь от «кривого бисквита» до тортов, за которые не стыдно просить деньги.
          </p>
          <button
            onClick={() => openCheckout("standard")}
            className="mt-7 inline-flex rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-8 py-4 text-base font-bold text-white transition hover:-translate-y-0.5"
          >
            Выбрать тариф →
          </button>
        </div>
      </Container>
    </section>
  );
}

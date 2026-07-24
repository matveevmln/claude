"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Countdown } from "@/components/ui/Countdown";
import { Reveal } from "@/components/ui/Reveal";
import { useCheckout } from "@/components/CheckoutProvider";

export function FinalCTA() {
  const openCheckout = useCheckout();

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-choco px-6 py-14 text-center sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute -top-16 right-[-5%] h-64 w-64 rounded-full bg-berry/25 blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-4rem] left-[-5%] h-64 w-64 rounded-full bg-gold-light/15 blur-3xl" />

            <h2 className="font-display text-3xl font-bold text-cream sm:text-4xl md:text-5xl">
              Ваш первый идеальный торт может случиться уже на этой неделе
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-cream/70 sm:text-lg">
              500+ учениц уже пекут иначе. Присоединяйтесь, пока действует цена запуска.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4">
              <Button size="lg" onClick={() => openCheckout("standard")}>
                Начать печь красиво →
              </Button>
              <Countdown className="opacity-90" />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

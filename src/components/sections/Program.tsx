"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Reveal } from "@/components/ui/Reveal";
import { modules } from "@/lib/content/product";

export function Program() {
  const [openIndex, setOpenIndex] = useState(1);

  return (
    <section id="program" className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Программа обучения"
          title="8 модулей — от первого бисквита до тортов на заказ"
          subtitle="40+ видеоуроков в системе, где каждый следующий модуль опирается на предыдущий — поэтому ничего не забывается."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="flex flex-col gap-2">
            {modules.map((m) => {
              const open = openIndex === m.index;
              return (
                <Reveal key={m.index} delay={m.index * 0.03}>
                  <div className={`overflow-hidden rounded-2xl border ${open ? "border-blush-deep bg-white" : "border-beige-line bg-white/50"}`}>
                    <button
                      onClick={() => setOpenIndex(open ? 0 : m.index)}
                      aria-expanded={open}
                      className="flex w-full items-center gap-4 px-5 py-4 text-left"
                    >
                      <span className="font-display text-lg font-extrabold text-berry-deep">
                        {String(m.index).padStart(2, "0")}
                      </span>
                      <span className="flex-1">
                        <span className="block font-display font-bold text-choco">{m.title}</span>
                        {open && <span className="mt-1 block text-xs text-choco-soft">{m.subtitle}</span>}
                      </span>
                    </button>
                    {open && (
                      <ul className="flex flex-col gap-1.5 px-5 pb-4 text-sm text-choco-soft">
                        {m.lessons.map((l) => (
                          <li key={l} className="flex gap-2">
                            <span aria-hidden className="text-berry-deep">•</span>
                            {l}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
          <PhotoSlot slotId="program-overview" ratio="aspect-[4/5]" label="Коллаж кадров из уроков курса" />
        </div>
      </Container>
    </section>
  );
}

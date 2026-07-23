"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faq } from "@/lib/content/product";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="bg-white/40 py-16 sm:py-24">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Вопросы" title="Отвечаем на то, что обычно спрашивают" />

        <div className="mt-10 flex flex-col gap-3">
          {faq.map((item, i) => {
            const open = openIndex === i;
            return (
              <div
                key={item.question}
                className="overflow-hidden rounded-3xl border border-beige-line bg-cream"
              >
                <button
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-choco"
                >
                  {item.question}
                  <span aria-hidden className="shrink-0 text-berry-deep">
                    {open ? "×" : "+"}
                  </span>
                </button>
                {open && (
                  <p className="px-5 pb-4 text-sm leading-relaxed text-choco-soft">{item.answer}</p>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

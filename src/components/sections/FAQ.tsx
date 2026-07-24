"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { faq } from "@/lib/content/product";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white/40 py-16 sm:py-24">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Вопросы" title="Отвечаем на то, что обычно спрашивают" />

        <div className="mt-10 flex flex-col gap-3">
          {faq.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={item.question} delay={i * 0.03}>
                <div
                  className={`overflow-hidden rounded-3xl border ${
                    isOpen ? "border-blush-deep bg-cream" : "border-beige-line bg-cream/60"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-choco focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-berry focus-visible:ring-inset"
                  >
                    {item.question}
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="shrink-0 text-xl text-berry" aria-hidden>
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-choco-soft">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

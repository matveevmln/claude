"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { modules } from "@/lib/content/product";

export function Program() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="program" className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Программа"
          title="8 модулей — от первого бисквита до тортов на заказ"
          subtitle="40+ видеоуроков в удобном порядке: каждый следующий модуль опирается на предыдущий, поэтому ничего не приходится пересматривать заново."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div className="flex flex-col gap-3">
            {modules.map((m, i) => {
              const isOpen = openIndex === i;
              return (
                <Reveal key={m.title} delay={i * 0.03}>
                  <div
                    className={`overflow-hidden rounded-3xl border transition-colors ${
                      isOpen ? "border-blush-deep bg-white shadow-[0_18px_40px_-28px_rgba(232,87,123,0.4)]" : "border-beige-line bg-white/40"
                    }`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      aria-controls={`module-panel-${m.index}`}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-berry focus-visible:ring-inset"
                    >
                      <span className="flex items-center gap-4">
                        <span className="font-display text-lg font-extrabold text-berry-deep">
                          {String(m.index).padStart(2, "0")}
                        </span>
                        <span>
                          <span className="block font-display font-bold text-choco">{m.title}</span>
                          <span className="block text-xs text-choco-soft">{m.subtitle}</span>
                        </span>
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        className="shrink-0 text-xl text-berry"
                        aria-hidden
                      >
                        +
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`module-panel-${m.index}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <ul className="flex flex-col gap-2 px-5 pb-5 pl-14">
                            {m.lessons.map((lesson) => (
                              <li key={lesson} className="flex gap-2 text-sm text-choco-soft">
                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-berry" />
                                {lesson}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div className="sticky top-24 hidden lg:block">
            <PhotoSlot
              slotId={modules[openIndex >= 0 ? openIndex : 0].imageSlot}
              ratio="aspect-[4/5]"
              label={`Фото к модулю: ${modules[openIndex >= 0 ? openIndex : 0].title}`}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

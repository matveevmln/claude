"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Countdown } from "@/components/ui/Countdown";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { SparkleGlyph } from "@/components/ui/Ornaments";
import { useCheckout } from "@/components/CheckoutProvider";
import { Container } from "@/components/ui/Container";

export function Hero() {
  const openCheckout = useCheckout();

  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24">
      <div className="pointer-events-none absolute -top-24 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-blush-deep/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-[-10%] h-80 w-80 rounded-full bg-gold-light/25 blur-3xl" />
      <SparkleGlyph className="pointer-events-none absolute right-[8%] top-10 hidden h-10 w-10 text-berry-soft sm:block" />
      <SparkleGlyph className="pointer-events-none absolute left-[6%] top-1/2 hidden h-6 w-6 text-gold-light lg:block" />

      <Container className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start gap-6"
        >
          <Eyebrow>Онлайн-программа для дома · 8 модулей</Eyebrow>

          <h1 className="font-display text-4xl font-bold leading-[1.05] text-choco sm:text-5xl md:text-[3.4rem]">
            Пеките торты,{" "}
            <span className="rose-gradient-text">за которые не стыдно</span> просить деньги
          </h1>

          <p className="max-w-xl text-lg text-choco-soft sm:text-xl">
            Пошаговая домашняя кондитерская: видеоуроки, точные граммовки и техкарты, которые
            превращают «получилось криво» в «а можно у вас заказать торт?».
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-choco-soft">
            <span className="flex items-center gap-1.5">
              <StarRow /> 4.9 из 500+ учениц
            </span>
            <span className="h-1 w-1 rounded-full bg-beige-line" />
            <span>Без опыта — с нуля</span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" onClick={() => openCheckout("standard")}>
              Начать печь красиво →
            </Button>
            <div className="flex items-center gap-3 rounded-2xl border border-blush-deep/50 bg-white/60 px-4 py-2.5">
              <span className="text-xs font-medium text-choco-soft">Цена запуска ещё активна:</span>
              <Countdown />
            </div>
          </div>

          <p className="text-xs text-choco-soft/70">
            Оплата картой · доступ навсегда · гарантия возврата 14 дней
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="relative"
        >
          <PhotoSlot
            slotId="hero-main"
            ratio="aspect-[4/5]"
            label="Фото: готовый торт крупным планом, тёплый свет, кремовая кухня"
            className="shadow-[0_30px_70px_-20px_rgba(200,60,95,0.3)]"
          />
          <div className="absolute -bottom-6 -left-6 hidden w-48 rounded-2xl border border-blush-deep/40 bg-white/95 p-4 shadow-xl backdrop-blur sm:block">
            <p className="text-xs font-semibold text-choco">«Первый заказ уже через 2 месяца»</p>
            <p className="mt-1 text-[11px] text-choco-soft">— Наталья, 52 года, Тюмень</p>
          </div>
          <div className="absolute -top-5 -right-4 hidden rounded-2xl border border-gold-light/50 bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur sm:block">
            <p className="font-display text-sm font-bold text-choco">4.9 ★ · 500+ учениц</p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function StarRow() {
  return (
    <span className="text-berry" aria-hidden>
      ★★★★★
    </span>
  );
}

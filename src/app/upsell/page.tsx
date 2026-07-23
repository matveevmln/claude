import Link from "next/link";
import { site } from "@/config/site";

export default function UpsellPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5 py-16">
      <div className="w-full max-w-lg rounded-[2.5rem] border border-blush-deep/50 bg-white p-8 text-center shadow-xl sm:p-10">
        <span className="inline-flex rounded-full bg-blush px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-berry-deep">
          Специально для вас
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold text-choco sm:text-3xl">
          Добавьте бонус-модуль «Торт на миллион»
        </h1>
        <p className="mt-3 text-sm text-choco-soft">
          Свадебные и многоярусные торты — то, за что клиенты готовы платить в 3-4 раза больше обычного заказа.
          Только сейчас — со скидкой как часть вашего заказа.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={`mailto:${site.supportEmail}?subject=Хочу бонус-модуль`}
            className="rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
          >
            Добавить бонус-модуль
          </a>
          <Link href="/login" className="rounded-full border border-beige-line px-6 py-3.5 text-sm font-bold text-choco">
            Нет, спасибо — в личный кабинет
          </Link>
        </div>
      </div>
    </div>
  );
}

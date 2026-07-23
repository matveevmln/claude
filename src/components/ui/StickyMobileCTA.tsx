"use client";

import { tariffs } from "@/lib/content/product";
import { useCheckout } from "@/components/CheckoutProvider";

/** Persistent mobile purchase bar — keeps the default tariff and CTA one tap away while scrolling the landing page. */
export function StickyMobileCTA() {
  const { openCheckout } = useCheckout();
  const tariff = tariffs.find((t) => t.id === "standard") ?? tariffs[0];

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-beige-line bg-white/95 px-4 py-3 backdrop-blur-md sm:hidden">
      <div>
        <p className="text-xs text-choco-soft">Тариф «{tariff.name}»</p>
        <p className="font-display text-lg font-extrabold text-choco">
          {tariff.price.toLocaleString("ru-RU")} ₽
        </p>
      </div>
      <button
        onClick={() => openCheckout(tariff.id)}
        className="shrink-0 rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
      >
        Забрать курс
      </button>
    </div>
  );
}

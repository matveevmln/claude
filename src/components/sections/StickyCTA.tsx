"use client";

import { useCheckout } from "@/components/CheckoutProvider";
import { Button } from "@/components/ui/Button";
import { tariffs } from "@/lib/content/product";

export function StickyCTA() {
  const openCheckout = useCheckout();
  const standard = tariffs.find((t) => t.id === "standard")!;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-beige-line bg-cream/95 p-3 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] text-choco-soft">Тариф «{standard.name}»</p>
          <p className="font-display text-lg font-bold text-choco">{standard.price.toLocaleString("ru-RU")} ₽</p>
        </div>
        <Button onClick={() => openCheckout("standard")}>Забрать курс</Button>
      </div>
    </div>
  );
}

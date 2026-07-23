"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { site } from "@/config/site";

function ThankYouContent() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const [status, setStatus] = useState<"pending" | "PAID" | "FAILED">("pending");

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;

    async function poll() {
      const res = await fetch(`/api/orders/${orderId}/status`);
      if (cancelled) return;
      if (res.ok) {
        const data = await res.json();
        if (data.status === "PAID" || data.status === "FAILED") {
          setStatus(data.status);
          return;
        }
      }
      setTimeout(poll, 2500);
    }
    poll();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-5 text-center">
      {status === "pending" && (
        <>
          <p className="text-4xl" aria-hidden>⏳</p>
          <h1 className="font-display text-2xl font-bold text-choco">Подтверждаем оплату…</h1>
          <p className="max-w-sm text-sm text-choco-soft">Обычно это занимает несколько секунд.</p>
        </>
      )}
      {status === "PAID" && (
        <>
          <p className="text-4xl" aria-hidden>🎉</p>
          <h1 className="font-display text-2xl font-bold text-choco">Оплата прошла успешно!</h1>
          <p className="max-w-sm text-sm text-choco-soft">
            Мы отправили логин и временный пароль на вашу почту. Проверьте папку «Спам», если письмо не пришло за пару минут.
          </p>
          <Link
            href="/login"
            className="mt-2 rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
          >
            Войти в личный кабинет
          </Link>
        </>
      )}
      {status === "FAILED" && (
        <>
          <p className="text-4xl" aria-hidden>😕</p>
          <h1 className="font-display text-2xl font-bold text-choco">Оплата не прошла</h1>
          <p className="max-w-sm text-sm text-choco-soft">
            Попробуйте ещё раз или напишите нам в поддержку: {site.supportEmail}
          </p>
          <Link href="/" className="mt-2 rounded-full border border-beige-line px-6 py-3 text-sm font-bold text-choco">
            На главную
          </Link>
        </>
      )}
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense>
      <ThankYouContent />
    </Suspense>
  );
}

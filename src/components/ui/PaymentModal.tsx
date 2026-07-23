"use client";

import { FormEvent, useEffect, useState } from "react";
import { tariffs } from "@/lib/content/product";

function getUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  return utm;
}

const REF_STORAGE_KEY = "dd_ref_code";
const REF_ATTRIBUTION_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

function getAffiliateCode(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const fromUrl = new URLSearchParams(window.location.search).get("ref");
  if (fromUrl) return fromUrl;

  try {
    const stored = JSON.parse(localStorage.getItem(REF_STORAGE_KEY) ?? "null");
    if (stored?.code && Date.now() - stored.savedAt < REF_ATTRIBUTION_WINDOW_MS) {
      return stored.code as string;
    }
  } catch {
    // ignore malformed storage
  }
  return undefined;
}

export function PaymentModal({ tariffId, onClose }: { tariffId: string; onClose: () => void }) {
  const tariff = tariffs.find((t) => t.id === tariffId);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Auto-apply a coupon shared via a landing-page link, e.g. /?coupon=SUMMER20
    const fromUrl = new URLSearchParams(window.location.search).get("coupon");
    if (fromUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCouponCode(fromUrl.toUpperCase());
    }
  }, []);

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeydown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeydown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tariffId,
          name,
          email,
          telegramUsername: telegramUsername || undefined,
          couponCode: couponCode || undefined,
          affiliateCode: getAffiliateCode(),
          utm: getUtm(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Не удалось создать заказ");
        setLoading(false);
        return;
      }
      window.location.href = data.paymentUrl;
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
      setLoading(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-choco/50 px-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm rounded-[2rem] border border-beige-line bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <h2 id="payment-modal-title" className="font-display text-lg font-bold text-choco">
            Оформление тарифа «{tariff?.name}»
          </h2>
          <button onClick={onClose} aria-label="Закрыть" className="text-2xl text-choco-soft hover:text-berry-deep">
            ×
          </button>
        </div>
        {tariff && (
          <p className="mt-1 font-display text-2xl font-extrabold text-choco">
            {tariff.price.toLocaleString("ru-RU")} ₽
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-choco-soft">Имя</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-beige-line bg-white px-4 py-3 text-sm outline-none focus:border-berry"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-choco-soft">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-beige-line bg-white px-4 py-3 text-sm outline-none focus:border-berry"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-choco-soft">Telegram (необязательно)</span>
            <input
              value={telegramUsername}
              onChange={(e) => setTelegramUsername(e.target.value)}
              placeholder="@username"
              className="w-full rounded-xl border border-beige-line bg-white px-4 py-3 text-sm outline-none focus:border-berry"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-choco-soft">Промокод (если есть)</span>
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full rounded-xl border border-beige-line bg-white px-4 py-3 text-sm outline-none focus:border-berry"
            />
          </label>

          {error && (
            <p role="alert" className="text-sm font-medium text-berry-deep">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            {loading ? "Переходим к оплате…" : "Перейти к оплате"}
          </button>
          <p className="text-center text-[11px] text-choco-soft">
            🔒 Безопасная оплата · Гарантия возврата 14 дней
          </p>
        </form>
      </div>
    </div>
  );
}

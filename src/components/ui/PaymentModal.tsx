"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { tariffs, type Tariff } from "@/lib/content/product";
import { Button } from "./Button";
import { track } from "@/lib/analytics";

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

const upgradePath: Partial<Record<Tariff["id"], Tariff["id"]>> = {
  basic: "standard",
  standard: "vip",
};

export function PaymentModal({
  tariffId,
  onClose,
}: {
  tariffId: Tariff["id"] | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {tariffId && <CheckoutSheet key={tariffId} initialTariffId={tariffId} onClose={onClose} />}
    </AnimatePresence>
  );
}

function CheckoutSheet({
  initialTariffId,
  onClose,
}: {
  initialTariffId: Tariff["id"];
  onClose: () => void;
}) {
  const [selectedId, setSelectedId] = useState<Tariff["id"]>(initialTariffId);
  const tariff = tariffs.find((t) => t.id === selectedId) ?? tariffs[0];
  const nextTariff = tariffs.find((t) => t.id === upgradePath[tariff.id]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-apply a coupon shared via a landing-page link, e.g. /?coupon=SUMMER20
    const fromUrl = new URLSearchParams(window.location.search).get("coupon");
    if (fromUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCouponCode(fromUrl.toUpperCase());
    }
    track("InitiateCheckout", { tariff: tariff.id, value: tariff.price });
    nameInputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!tariff) return;
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tariffId: tariff.id,
          name,
          email,
          telegramUsername: telegramUsername || undefined,
          couponCode: couponCode || undefined,
          affiliateCode: getAffiliateCode(),
          utm: getUtm(),
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Не удалось создать оплату");

      track("Lead", { tariff: tariff.id, value: tariff.price });
      window.location.href = data.paymentUrl;
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Что-то пошло не так, попробуйте ещё раз");
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-choco/55 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-heading"
        className="w-full max-w-md rounded-t-[2rem] border border-blush-deep/40 bg-cream p-6 shadow-2xl sm:rounded-[2rem] sm:p-8"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p id="checkout-heading" className="text-xs font-bold uppercase tracking-wide text-berry">
              Тариф «{tariff.name}»
            </p>
            <p className="font-display text-2xl font-extrabold text-choco">
              {tariff.price.toLocaleString("ru-RU")} ₽
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Закрыть окно оплаты"
            className="rounded-full p-2 text-choco-soft hover:bg-beige focus-visible:ring-2 focus-visible:ring-berry"
          >
            ✕
          </button>
        </div>

        {nextTariff && (
          <button
            type="button"
            onClick={() => setSelectedId(nextTariff.id)}
            className="mb-5 w-full rounded-2xl border border-gold-light/60 bg-gradient-to-r from-gold-light/20 to-blush/40 p-4 text-left transition hover:border-gold"
          >
            <p className="text-xs font-bold text-gold-deep">
              ✨ Улучшить за разницу в {(nextTariff.price - tariff.price).toLocaleString("ru-RU")} ₽
            </p>
            <p className="mt-1 text-sm font-semibold text-choco">
              Перейти на «{nextTariff.name}» — {nextTariff.price.toLocaleString("ru-RU")} ₽
            </p>
            <p className="mt-0.5 text-xs text-choco-soft">{nextTariff.features[1]}</p>
          </button>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field label="Ваше имя">
            <input
              ref={nameInputRef}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Как к вам обращаться"
              autoComplete="name"
              className="w-full rounded-xl border border-beige-line bg-white px-4 py-3 text-sm outline-none focus:border-berry"
            />
          </Field>
          <Field label="Email — куда придёт доступ">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-xl border border-beige-line bg-white px-4 py-3 text-sm outline-none focus:border-berry"
            />
          </Field>
          <Field label="Telegram (необязательно)">
            <input
              value={telegramUsername}
              onChange={(e) => setTelegramUsername(e.target.value)}
              placeholder="@username"
              className="w-full rounded-xl border border-beige-line bg-white px-4 py-3 text-sm outline-none focus:border-berry"
            />
          </Field>
          <Field label="Промокод (если есть)">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full rounded-xl border border-beige-line bg-white px-4 py-3 text-sm outline-none focus:border-berry"
            />
          </Field>

          {status === "error" && (
            <p role="alert" className="text-sm font-medium text-berry-deep">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="mt-2 w-full" disabled={status === "loading"}>
            {status === "loading" ? "Переходим к оплате…" : "Перейти к оплате"}
          </Button>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-choco-soft/70">
            <span>🔒 Безопасный платёж</span>
            <span aria-hidden>·</span>
            <span>💳 Visa · Mastercard · МИР</span>
            <span aria-hidden>·</span>
            <span>↩️ Возврат за 14 дней</span>
          </div>
          <p className="text-center text-xs text-choco-soft/70">
            Доступ придёт автоматически на почту и в Telegram в течение 1–2 минут.
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-choco-soft">{label}</span>
      {children}
    </label>
  );
}

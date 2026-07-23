"use client";

import { useState } from "react";

export function CertificateCard() {
  const [serial, setSerial] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function generate() {
    setLoading(true);
    setError(false);
    const res = await fetch("/api/account/certificate", { method: "POST" });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.serial) setSerial(data.serial);
    else setError(true);
    setLoading(false);
  }

  return (
    <div className="rounded-3xl border border-gold-light/60 bg-gradient-to-b from-white to-gold-light/10 p-6">
      <p className="text-xs font-bold uppercase tracking-wide text-gold-deep">Поздравляем!</p>
      <h2 className="mt-1 font-display text-xl font-bold text-choco">Курс пройден на 100%</h2>
      <p className="mt-1 text-sm text-choco-soft">Получите именной сертификат о прохождении курса.</p>
      {serial ? (
        <a
          href={`/certificate/${serial}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
        >
          Открыть сертификат →
        </a>
      ) : (
        <button
          onClick={generate}
          disabled={loading}
          className="mt-4 inline-flex rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {loading ? "Готовим…" : "Получить сертификат"}
        </button>
      )}
      {error && <p className="mt-2 text-xs text-berry-deep">Не удалось получить сертификат</p>}
    </div>
  );
}

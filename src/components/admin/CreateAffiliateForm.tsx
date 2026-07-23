"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function CreateAffiliateForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [commissionPercent, setCommissionPercent] = useState(20);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/affiliates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, commissionPercent }),
    });
    if (res.ok) {
      setEmail("");
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Не удалось создать партнёра");
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 rounded-3xl border border-beige-line bg-white/60 p-5">
      <label className="flex flex-col gap-1 text-xs text-choco-soft">
        Email существующего пользователя
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-64 rounded-xl border border-beige-line bg-white px-3 py-2 text-sm"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-choco-soft">
        Комиссия, %
        <input
          type="number"
          min={1}
          max={80}
          value={commissionPercent}
          onChange={(e) => setCommissionPercent(Number(e.target.value))}
          className="w-24 rounded-xl border border-beige-line bg-white px-3 py-2 text-sm"
        />
      </label>
      {error && <p className="text-xs text-berry-deep">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
      >
        {saving ? "Создаю…" : "Сделать партнёром"}
      </button>
    </form>
  );
}

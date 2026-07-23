"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function CreateCouponForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [percentOff, setPercentOff] = useState("");
  const [maxRedemptions, setMaxRedemptions] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        percentOff: percentOff ? Number(percentOff) : undefined,
        maxRedemptions: maxRedemptions ? Number(maxRedemptions) : undefined,
      }),
    });
    if (res.ok) {
      setCode("");
      setPercentOff("");
      setMaxRedemptions("");
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Не удалось создать купон");
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 rounded-3xl border border-beige-line bg-white/60 p-5">
      <label className="flex flex-col gap-1 text-xs text-choco-soft">
        Код
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          required
          className="w-40 rounded-xl border border-beige-line bg-white px-3 py-2 text-sm"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-choco-soft">
        Скидка, %
        <input
          type="number"
          value={percentOff}
          onChange={(e) => setPercentOff(e.target.value)}
          min={1}
          max={100}
          className="w-28 rounded-xl border border-beige-line bg-white px-3 py-2 text-sm"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-choco-soft">
        Лимит использований
        <input
          type="number"
          value={maxRedemptions}
          onChange={(e) => setMaxRedemptions(e.target.value)}
          min={1}
          className="w-40 rounded-xl border border-beige-line bg-white px-3 py-2 text-sm"
        />
      </label>
      {error && <p className="text-xs text-berry-deep">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
      >
        {saving ? "Создаю…" : "Создать купон"}
      </button>
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function GrantAccessForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [tariffSlug, setTariffSlug] = useState("standard");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ tempPassword?: string; isNewAccount: boolean } | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setResult(null);
    const res = await fetch("/api/admin/grant-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name: name || undefined, tariffSlug }),
    });
    const data = await res.json().catch(() => null);
    if (res.ok) {
      setResult(data);
      setEmail("");
      setName("");
      router.refresh();
    } else {
      setError(data?.error ?? "Не удалось открыть доступ");
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 rounded-3xl border border-beige-line bg-white/60 p-5">
      <label className="flex flex-col gap-1 text-xs text-choco-soft">
        Email клиента
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-56 rounded-xl border border-beige-line bg-white px-3 py-2 text-sm"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-choco-soft">
        Имя (если новый)
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-48 rounded-xl border border-beige-line bg-white px-3 py-2 text-sm"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-choco-soft">
        Тариф
        <select
          value={tariffSlug}
          onChange={(e) => setTariffSlug(e.target.value)}
          className="rounded-xl border border-beige-line bg-white px-3 py-2 text-sm"
        >
          <option value="basic">Базовый</option>
          <option value="standard">Стандарт</option>
          <option value="vip">VIP</option>
        </select>
      </label>
      {error && <p className="text-xs text-berry-deep">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
      >
        {saving ? "Открываю…" : "Открыть доступ"}
      </button>
      {result && (
        <p className="w-full rounded-xl bg-blush/60 px-3 py-2 text-xs text-berry-deep">
          {result.isNewAccount
            ? `Аккаунт создан. Временный пароль: ${result.tempPassword}`
            : "Доступ добавлен к существующему аккаунту."}
        </p>
      )}
    </form>
  );
}

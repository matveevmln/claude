"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const TYPE_OPTIONS = ["course", "ebook", "template", "membership", "bundle"];

export function CreateProductForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("course");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, name, type }),
    });
    if (res.ok) {
      setSlug("");
      setName("");
      setOpen(false);
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Не удалось создать продукт");
    }
    setSaving(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-choco px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-choco/90"
      >
        + Новый продукт
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 rounded-3xl border border-beige-line bg-white/60 p-5">
      <label className="flex flex-col gap-1 text-xs text-choco-soft">
        Название
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-56 rounded-xl border border-beige-line bg-white px-3 py-2 text-sm outline-none focus:border-berry"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-choco-soft">
        Slug (латиницей)
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase())}
          required
          pattern="[a-z0-9\-]+"
          className="w-48 rounded-xl border border-beige-line bg-white px-3 py-2 text-sm outline-none focus:border-berry"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-choco-soft">
        Тип
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-40 rounded-xl border border-beige-line bg-white px-3 py-2 text-sm outline-none focus:border-berry"
        >
          {TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      {error && <p className="text-xs text-berry-deep">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-5 py-2.5 text-sm font-bold text-white transition disabled:opacity-50"
      >
        {saving ? "Создаю…" : "Создать"}
      </button>
      <button type="button" onClick={() => setOpen(false)} className="text-xs text-choco-soft hover:text-berry-deep">
        Отмена
      </button>
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProductFieldsForm({
  productId,
  initialName,
  initialDescription,
  initialActive,
}: {
  productId: string;
  initialName: string;
  initialDescription: string;
  initialActive: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [active, setActive] = useState(initialActive);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, active }),
    });
    if (res.ok) router.refresh();
    setSaving(false);
  }

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-beige-line bg-white/60 p-6">
      <label className="flex flex-col gap-1 text-xs text-choco-soft">
        Название
        <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border border-beige-line bg-white px-3 py-2 text-sm" />
      </label>
      <label className="flex flex-col gap-1 text-xs text-choco-soft">
        Описание
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="rounded-2xl border border-beige-line bg-white px-3 py-2 text-sm" />
      </label>
      <label className="flex items-center gap-1.5 text-xs text-choco-soft">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        Продукт активен (виден в чек-ауте)
      </label>
      <button
        onClick={save}
        disabled={saving}
        className="self-start rounded-full bg-choco px-5 py-2 text-xs font-semibold text-cream disabled:opacity-50"
      >
        {saving ? "Сохраняю…" : "Сохранить"}
      </button>
    </div>
  );
}

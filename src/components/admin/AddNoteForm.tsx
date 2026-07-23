"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function AddNoteForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSaving(true);
    setError("");
    const res = await fetch(`/api/admin/customers/${userId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (res.ok) {
      setBody("");
      router.refresh();
    } else {
      setError("Не удалось сохранить заметку");
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Заметка о клиенте — видна только администраторам"
        rows={3}
        className="w-full rounded-2xl border border-beige-line bg-white px-4 py-3 text-sm outline-none focus:border-berry"
      />
      {error && <p className="text-xs text-berry-deep">{error}</p>}
      <button
        type="submit"
        disabled={saving || !body.trim()}
        className="self-start rounded-full bg-choco px-5 py-2 text-xs font-semibold text-cream transition hover:bg-choco/90 disabled:opacity-50"
      >
        {saving ? "Сохраняю…" : "Добавить заметку"}
      </button>
    </form>
  );
}

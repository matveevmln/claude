"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Announcement = { id: string; title: string; body: string; publishedAt: string };

export function AnnouncementManager({ announcements }: { announcements: Announcement[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });
    if (res.ok) {
      setTitle("");
      setBody("");
      router.refresh();
    }
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Удалить объявление?")) return;
    const res = await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-3xl border border-beige-line bg-white/60 p-6">
        <h2 className="font-display text-lg font-bold text-choco">Новое объявление</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Заголовок"
          className="rounded-xl border border-beige-line bg-white px-4 py-2.5 text-sm outline-none focus:border-berry"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Текст объявления — увидят все ученицы на дашборде"
          rows={3}
          className="rounded-2xl border border-beige-line bg-white px-4 py-3 text-sm outline-none focus:border-berry"
        />
        <button
          type="submit"
          disabled={saving || !title.trim() || !body.trim()}
          className="self-start rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          {saving ? "Публикую…" : "Опубликовать"}
        </button>
      </form>

      <div className="flex flex-col gap-3">
        {announcements.map((a) => (
          <div key={a.id} className="flex items-start justify-between gap-3 rounded-2xl border border-beige-line bg-white/60 p-4">
            <div>
              <p className="font-semibold text-choco">{a.title}</p>
              <p className="text-sm text-choco-soft">{a.body}</p>
              <p className="mt-1 text-xs text-choco-soft">{new Date(a.publishedAt).toLocaleDateString("ru-RU")}</p>
            </div>
            <button onClick={() => remove(a.id)} className="shrink-0 text-xs text-choco-soft hover:text-berry-deep">
              Удалить
            </button>
          </div>
        ))}
        {announcements.length === 0 && <p className="text-sm text-choco-soft">Пока нет объявлений</p>}
      </div>
    </div>
  );
}

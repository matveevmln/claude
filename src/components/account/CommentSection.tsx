"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Author = { id: string; name: string | null };

type Comment = {
  id: string;
  body: string;
  createdAt: string;
  userId: string;
  parentId: string | null;
};

export function CommentSection({
  lessonId,
  comments,
  authors,
  currentUserId,
}: {
  lessonId: string;
  comments: Comment[];
  authors: Record<string, Author>;
  currentUserId: string;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    const res = await fetch(`/api/account/lessons/${lessonId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (res.ok) {
      setBody("");
      router.refresh();
    }
    setSending(false);
  }

  function authorLabel(userId: string) {
    if (userId === currentUserId) return "Вы";
    return authors[userId]?.name ?? "Ученица";
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-lg font-bold text-choco">Обсуждение урока</h2>

      <ul className="flex flex-col gap-3">
        {comments.map((c) => (
          <li key={c.id} className="rounded-2xl border border-beige-line/60 bg-white/60 p-4 text-sm">
            <p className="text-choco">{c.body}</p>
            <p className="mt-2 text-xs text-choco-soft">
              {authorLabel(c.userId)} · {new Date(c.createdAt).toLocaleString("ru-RU")}
            </p>
          </li>
        ))}
        {comments.length === 0 && <p className="text-sm text-choco-soft">Пока нет комментариев — будьте первой!</p>}
      </ul>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Задайте вопрос или поделитесь результатом…"
          rows={3}
          className="w-full rounded-2xl border border-beige-line bg-white px-4 py-3 text-sm outline-none focus:border-berry"
        />
        <button
          type="submit"
          disabled={sending || !body.trim()}
          className="self-start rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-5 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-50"
        >
          {sending ? "Отправляю…" : "Отправить"}
        </button>
      </form>
    </div>
  );
}

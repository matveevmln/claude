"use client";

import { FormEvent, useState } from "react";

export function SendEmailForm({ userId }: { userId: string }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSending(true);
    setStatus("idle");
    const res = await fetch(`/api/admin/customers/${userId}/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, message }),
    });
    if (res.ok) {
      setStatus("sent");
      setSubject("");
      setMessage("");
    } else {
      setStatus("error");
    }
    setSending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Тема письма"
        className="w-full rounded-xl border border-beige-line bg-white px-4 py-2.5 text-sm outline-none focus:border-berry"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Текст письма"
        rows={4}
        className="w-full rounded-2xl border border-beige-line bg-white px-4 py-3 text-sm outline-none focus:border-berry"
      />
      {status === "error" && <p className="text-xs text-berry-deep">Не удалось отправить письмо</p>}
      {status === "sent" && <p className="text-xs text-berry-deep">Письмо отправлено</p>}
      <button
        type="submit"
        disabled={sending || !subject.trim() || !message.trim()}
        className="self-start rounded-full bg-choco px-5 py-2 text-xs font-semibold text-cream transition hover:bg-choco/90 disabled:opacity-50"
      >
        {sending ? "Отправляю…" : "Отправить письмо"}
      </button>
    </form>
  );
}

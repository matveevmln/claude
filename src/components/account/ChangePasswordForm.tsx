"use client";

import { FormEvent, useState } from "react";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    const res = await fetch("/api/account/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (res.ok) {
      setStatus("done");
      setCurrentPassword("");
      setNewPassword("");
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Не удалось сменить пароль");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-choco-soft">Текущий пароль</span>
        <input
          required
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full rounded-xl border border-beige-line bg-white px-4 py-2.5 text-sm outline-none focus:border-berry"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-choco-soft">Новый пароль</span>
        <input
          required
          type="password"
          minLength={8}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-xl border border-beige-line bg-white px-4 py-2.5 text-sm outline-none focus:border-berry"
        />
      </label>
      {status === "error" && <p className="text-xs text-berry-deep">{error}</p>}
      {status === "done" && <p className="text-xs text-berry-deep">Пароль обновлён</p>}
      <button
        type="submit"
        disabled={status === "saving"}
        className="self-start rounded-full bg-choco px-5 py-2.5 text-xs font-semibold text-cream disabled:opacity-50"
      >
        {status === "saving" ? "Сохраняю…" : "Сменить пароль"}
      </button>
    </form>
  );
}

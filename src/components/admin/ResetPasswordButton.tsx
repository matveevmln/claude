"use client";

import { useState } from "react";

export function ResetPasswordButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function reset() {
    if (!confirm("Сбросить пароль клиента и отправить новый на email?")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/customers/${userId}/reset-password`, { method: "POST" });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.tempPassword) {
      setResult(data.tempPassword);
    } else {
      setResult("error");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={reset}
        disabled={loading}
        className="self-start rounded-full border border-beige-line px-4 py-2 text-xs font-semibold text-choco-soft transition hover:bg-white disabled:opacity-50"
      >
        {loading ? "Сбрасываю…" : "Сбросить пароль вручную"}
      </button>
      {result === "error" && <p className="text-xs text-berry-deep">Не удалось сбросить пароль</p>}
      {result && result !== "error" && (
        <p className="rounded-xl bg-blush/60 px-3 py-2 text-xs text-berry-deep">
          Новый пароль отправлен на email клиента. Временный пароль: <strong>{result}</strong>
        </p>
      )}
    </div>
  );
}

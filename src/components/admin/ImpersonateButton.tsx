"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ImpersonateButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function start() {
    setLoading(true);
    const res = await fetch("/api/admin/impersonate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      router.push("/account");
    } else {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={start}
      disabled={loading}
      className="rounded-full border border-beige-line px-3 py-1.5 text-xs font-semibold text-choco-soft transition hover:bg-white disabled:opacity-50"
    >
      {loading ? "Открываю…" : "Войти как клиент"}
    </button>
  );
}

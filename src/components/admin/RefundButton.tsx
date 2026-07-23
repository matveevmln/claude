"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RefundButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function refund() {
    const reason = prompt("Причина возврата (необязательно):") ?? "";
    if (!confirm("Отметить заказ как возвращённый?")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${orderId}/refund`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: reason || undefined }),
    });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Не удалось оформить возврат");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={refund}
      disabled={loading}
      className="rounded-full border border-beige-line px-3 py-1.5 text-xs font-semibold text-choco-soft transition hover:bg-white disabled:opacity-50"
    >
      {loading ? "…" : "Оформить возврат"}
    </button>
  );
}

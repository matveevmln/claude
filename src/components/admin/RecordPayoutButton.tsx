"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RecordPayoutButton({ affiliateId }: { affiliateId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function record() {
    const amountStr = prompt("Сумма выплаты, ₽:");
    if (!amountStr) return;
    const amount = Number(amountStr);
    if (!Number.isFinite(amount) || amount <= 0) return;

    setLoading(true);
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const res = await fetch(`/api/admin/affiliates/${affiliateId}/payouts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, periodStart: monthAgo.toISOString(), periodEnd: now.toISOString() }),
    });
    if (res.ok) router.refresh();
    else alert("Не удалось записать выплату");
    setLoading(false);
  }

  return (
    <button
      onClick={record}
      disabled={loading}
      className="rounded-full border border-beige-line px-3 py-1.5 text-xs font-semibold text-choco-soft transition hover:bg-white disabled:opacity-50"
    >
      {loading ? "…" : "Записать выплату"}
    </button>
  );
}

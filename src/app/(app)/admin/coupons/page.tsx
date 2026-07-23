import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { CreateCouponForm } from "@/components/admin/CreateCouponForm";

export default async function AdminCouponsPage() {
  await requireAdmin();
  const coupons = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-choco sm:text-3xl">Купоны</h1>

      <CreateCouponForm />

      <div className="overflow-x-auto rounded-3xl border border-beige-line bg-white/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-beige-line text-left text-xs uppercase text-choco-soft">
              <th className="p-4">Код</th>
              <th className="p-4">Скидка</th>
              <th className="p-4">Использован</th>
              <th className="p-4">Лимит</th>
              <th className="p-4">Активен</th>
              <th className="p-4">Истекает</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-beige-line/60 last:border-0">
                <td className="p-4 font-mono text-choco">{c.code}</td>
                <td className="p-4 text-choco-soft">
                  {c.percentOff ? `${c.percentOff}%` : c.amountOff ? `${c.amountOff} ₽` : "—"}
                </td>
                <td className="p-4 text-choco-soft">{c.timesRedeemed}</td>
                <td className="p-4 text-choco-soft">{c.maxRedemptions ?? "∞"}</td>
                <td className="p-4 text-choco-soft">{c.active ? "Да" : "Нет"}</td>
                <td className="p-4 text-choco-soft">
                  {c.expiresAt ? c.expiresAt.toLocaleDateString("ru-RU") : "—"}
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-choco-soft">
                  Пока нет купонов
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { db } from "@/lib/db";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/requireAdmin";

export default async function AdminOrdersPage() {
  await requireAdmin();

  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { tariff: true, coupon: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-choco sm:text-3xl">Заказы</h1>

      <div className="overflow-x-auto rounded-3xl border border-beige-line bg-white/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-beige-line text-left text-xs uppercase text-choco-soft">
              <th className="p-4">Email</th>
              <th className="p-4">Тариф</th>
              <th className="p-4">Сумма</th>
              <th className="p-4">Купон</th>
              <th className="p-4">Источник</th>
              <th className="p-4">Статус</th>
              <th className="p-4">Дата</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-beige-line/60 last:border-0">
                <td className="p-4 text-choco">{o.email}</td>
                <td className="p-4 text-choco-soft">{o.tariff.name}</td>
                <td className="p-4 text-choco-soft">{o.amount.toLocaleString("ru-RU")} ₽</td>
                <td className="p-4 text-choco-soft">{o.coupon?.code ?? "—"}</td>
                <td className="p-4 text-choco-soft">{o.utmSource ?? "—"}</td>
                <td className="p-4">
                  <StatusBadge status={o.status} />
                </td>
                <td className="p-4 text-choco-soft">{o.createdAt.toLocaleDateString("ru-RU")}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-choco-soft">
                  Пока нет заказов
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [totalRevenue, paidOrders, totalCustomers, pendingOrders] = await Promise.all([
    db.order.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
    db.order.count({ where: { status: "PAID" } }),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.order.count({ where: { status: "PENDING" } }),
  ]);

  const recentOrders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { tariff: true },
  });

  const paidOrdersForUtm = await db.order.findMany({
    where: { status: "PAID" },
    select: { amount: true, utmSource: true, utmCampaign: true },
  });
  const bySource = new Map<string, { orders: number; revenue: number }>();
  for (const o of paidOrdersForUtm) {
    const key = o.utmSource || "прямой заход";
    const entry = bySource.get(key) ?? { orders: 0, revenue: 0 };
    entry.orders += 1;
    entry.revenue += o.amount;
    bySource.set(key, entry);
  }
  const utmBreakdown = Array.from(bySource.entries())
    .map(([source, stats]) => ({ source, ...stats }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-choco sm:text-3xl">Обзор</h1>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Выручка" value={`${(totalRevenue._sum.amount ?? 0).toLocaleString("ru-RU")} ₽`} />
        <StatCard label="Оплаченных заказов" value={String(paidOrders)} />
        <StatCard label="Клиентов" value={String(totalCustomers)} />
        <StatCard label="Ожидают оплаты" value={String(pendingOrders)} />
      </div>

      <div className="rounded-3xl border border-beige-line bg-white/60 p-6">
        <h2 className="font-display text-lg font-bold text-choco">Последние заказы</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {recentOrders.map((o) => (
            <li key={o.id} className="flex justify-between border-b border-beige-line/60 pb-2 text-sm last:border-0">
              <span className="text-choco">{o.email}</span>
              <span className="text-choco-soft">{o.tariff.name} · {o.amount.toLocaleString("ru-RU")} ₽</span>
            </li>
          ))}
          {recentOrders.length === 0 && <p className="text-sm text-choco-soft">Пока нет заказов</p>}
        </ul>
      </div>

      <div className="rounded-3xl border border-beige-line bg-white/60 p-6">
        <h2 className="font-display text-lg font-bold text-choco">Заказы по UTM-источнику</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-beige-line text-left text-xs uppercase text-choco-soft">
                <th className="py-2 pr-4">Источник</th>
                <th className="py-2 pr-4">Заказов</th>
                <th className="py-2">Выручка</th>
              </tr>
            </thead>
            <tbody>
              {utmBreakdown.map((row) => (
                <tr key={row.source} className="border-b border-beige-line/60 last:border-0">
                  <td className="py-2 pr-4 text-choco">{row.source}</td>
                  <td className="py-2 pr-4 text-choco-soft">{row.orders}</td>
                  <td className="py-2 text-choco-soft">{row.revenue.toLocaleString("ru-RU")} ₽</td>
                </tr>
              ))}
              {utmBreakdown.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-choco-soft">
                    Пока нет оплаченных заказов
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-beige-line bg-white/60 p-5">
      <p className="font-display text-2xl font-extrabold text-berry-deep">{value}</p>
      <p className="mt-1 text-xs text-choco-soft">{label}</p>
    </div>
  );
}

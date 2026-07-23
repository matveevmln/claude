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

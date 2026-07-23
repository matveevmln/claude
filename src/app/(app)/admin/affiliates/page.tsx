import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { site } from "@/config/site";
import { CreateAffiliateForm } from "@/components/admin/CreateAffiliateForm";
import { RecordPayoutButton } from "@/components/admin/RecordPayoutButton";

export default async function AdminAffiliatesPage() {
  await requireAdmin();

  const affiliates = await db.affiliatePartner.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      orders: { where: { status: "PAID" } },
      payouts: { orderBy: { createdAt: "desc" } },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-choco sm:text-3xl">Партнёрская программа</h1>
        <p className="mt-1 text-sm text-choco-soft">
          Партнёр делится ссылкой вида <code className="text-berry-deep">{site.domain}/?ref=КОД</code> — заказ
          автоматически привязывается к партнёру, если покупатель пришёл по этой ссылке.
        </p>
      </div>

      <CreateAffiliateForm />

      <div className="flex flex-col gap-4">
        {affiliates.map((a) => {
          const totalSales = a.orders.reduce((sum, o) => sum + o.amount, 0);
          const totalCommissionDue = Math.round((totalSales * a.commissionPercent) / 100);
          const totalPaid = a.payouts.reduce((sum, p) => sum + p.amount, 0);
          const balance = totalCommissionDue - totalPaid;

          return (
            <div key={a.id} className="rounded-3xl border border-beige-line bg-white/60 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold text-choco">{a.user.name ?? a.user.email}</p>
                  <p className="text-xs text-choco-soft">
                    {a.user.email} · код <code className="text-berry-deep">{a.code}</code> · комиссия {a.commissionPercent}%
                  </p>
                </div>
                <RecordPayoutButton affiliateId={a.id} />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <Stat label="Продаж" value={String(a.orders.length)} />
                <Stat label="Оборот" value={`${totalSales.toLocaleString("ru-RU")} ₽`} />
                <Stat label="Начислено" value={`${totalCommissionDue.toLocaleString("ru-RU")} ₽`} />
                <Stat label="Остаток к выплате" value={`${balance.toLocaleString("ru-RU")} ₽`} />
              </div>

              {a.payouts.length > 0 && (
                <div className="mt-4 border-t border-beige-line pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-choco-soft">История выплат</p>
                  <ul className="mt-2 flex flex-col gap-1 text-xs text-choco-soft">
                    {a.payouts.map((p) => (
                      <li key={p.id} className="flex justify-between">
                        <span>{p.amount.toLocaleString("ru-RU")} ₽</span>
                        <span>{p.createdAt.toLocaleDateString("ru-RU")}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
        {affiliates.length === 0 && <p className="text-sm text-choco-soft">Пока нет партнёров</p>}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-beige-line bg-white p-4">
      <p className="font-display text-lg font-extrabold text-berry-deep">{value}</p>
      <p className="mt-1 text-xs text-choco-soft">{label}</p>
    </div>
  );
}

import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getEffectiveUserId } from "@/lib/impersonation";
import { site } from "@/config/site";
import { CopyReferralLink } from "@/components/account/CopyReferralLink";

export default async function AffiliatePage() {
  const session = await auth();
  const { userId } = await getEffectiveUserId(session!);

  const affiliate = await db.affiliatePartner.findUnique({
    where: { userId },
    include: {
      orders: { where: { status: "PAID" }, orderBy: { createdAt: "desc" } },
      payouts: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!affiliate) notFound();

  const totalSales = affiliate.orders.reduce((sum, o) => sum + o.amount, 0);
  const totalCommission = Math.round((totalSales * affiliate.commissionPercent) / 100);
  const totalPaid = affiliate.payouts.reduce((sum, p) => sum + p.amount, 0);
  const referralUrl = `${site.domain}/?ref=${affiliate.code}`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-berry-deep">Партнёрская программа</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-choco sm:text-3xl">Ваша реферальная ссылка</h1>
        <p className="mt-1 text-sm text-choco-soft">
          Комиссия {affiliate.commissionPercent}% с каждой продажи по вашей ссылке.
        </p>
      </div>

      <CopyReferralLink url={referralUrl} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Продаж" value={String(affiliate.orders.length)} />
        <StatCard label="Начислено" value={`${totalCommission.toLocaleString("ru-RU")} ₽`} />
        <StatCard label="Уже выплачено" value={`${totalPaid.toLocaleString("ru-RU")} ₽`} />
      </div>

      <div className="rounded-3xl border border-beige-line bg-white/60 p-6">
        <h2 className="font-display text-lg font-bold text-choco">Продажи по вашей ссылке</h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm">
          {affiliate.orders.map((o) => (
            <li key={o.id} className="flex justify-between border-b border-beige-line/60 pb-2 last:border-0">
              <span className="text-choco">{o.amount.toLocaleString("ru-RU")} ₽</span>
              <span className="text-choco-soft">{o.createdAt.toLocaleDateString("ru-RU")}</span>
            </li>
          ))}
          {affiliate.orders.length === 0 && <p className="text-choco-soft">Пока нет продаж по вашей ссылке</p>}
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

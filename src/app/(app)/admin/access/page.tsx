import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { GrantAccessForm } from "@/components/admin/GrantAccessForm";

export default async function AdminAccessPage() {
  await requireAdmin();
  const recentGrants = await db.enrollment.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { user: true, tariff: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-choco sm:text-3xl">Доступ вручную</h1>
      <p className="text-sm text-choco-soft">
        Откройте доступ клиенту, который оплатил вне сайта (перевод, наличные и т.п.) — аккаунт создастся
        автоматически, если его ещё нет.
      </p>

      <GrantAccessForm />

      <div className="rounded-3xl border border-beige-line bg-white/60 p-6">
        <h2 className="font-display text-lg font-bold text-choco">Последние ручные назначения</h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm">
          {recentGrants.map((g) => (
            <li key={g.id} className="flex justify-between border-b border-beige-line/60 pb-2 last:border-0">
              <span className="text-choco">{g.user.email}</span>
              <span className="text-choco-soft">
                {g.tariff.name} · {g.createdAt.toLocaleDateString("ru-RU")}
              </span>
            </li>
          ))}
          {recentGrants.length === 0 && <p className="text-choco-soft">Пока нет назначений</p>}
        </ul>
      </div>
    </div>
  );
}

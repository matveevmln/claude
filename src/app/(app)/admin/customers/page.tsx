import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { ImpersonateButton } from "@/components/admin/ImpersonateButton";
import type { Prisma } from "@/generated/prisma/client";

export default async function AdminCustomersPage({ searchParams }: PageProps<"/admin/customers">) {
  await requireAdmin();
  const { q, tag } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";
  const tagFilter = typeof tag === "string" ? tag.trim() : "";

  const where: Prisma.UserWhereInput = {
    role: "CUSTOMER",
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(tagFilter ? { tags: { has: tagFilter } } : {}),
  };

  const customers = await db.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { enrollments: { include: { tariff: true } } },
  });

  const allTags = await db.user.findMany({
    where: { role: "CUSTOMER" },
    select: { tags: true },
  });
  const tagOptions = Array.from(new Set(allTags.flatMap((u) => u.tags))).sort();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-choco sm:text-3xl">Клиенты</h1>
        <a
          href="/api/admin/customers/export"
          className="rounded-full border border-beige-line px-4 py-2 text-xs font-semibold text-choco-soft transition hover:bg-white"
        >
          Экспорт в CSV
        </a>
      </div>

      <form className="flex flex-wrap items-center gap-3" method="get">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Поиск по имени или email"
          className="min-w-[240px] flex-1 rounded-full border border-beige-line bg-white px-4 py-2.5 text-sm outline-none focus:border-berry"
        />
        {tagOptions.length > 0 && (
          <select
            name="tag"
            defaultValue={tagFilter}
            className="rounded-full border border-beige-line bg-white px-4 py-2.5 text-sm outline-none focus:border-berry"
          >
            <option value="">Все теги</option>
            {tagOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}
        <button
          type="submit"
          className="rounded-full bg-choco px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-choco/90"
        >
          Найти
        </button>
        {(query || tagFilter) && (
          <Link href="/admin/customers" className="text-xs text-choco-soft hover:text-berry-deep">
            Сбросить
          </Link>
        )}
      </form>

      <div className="overflow-x-auto rounded-3xl border border-beige-line bg-white/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-beige-line text-left text-xs uppercase text-choco-soft">
              <th className="p-4">Имя</th>
              <th className="p-4">Email</th>
              <th className="p-4">Тарифы</th>
              <th className="p-4">Теги</th>
              <th className="p-4">С нами с</th>
              <th className="p-4">Действия</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-beige-line/60 last:border-0">
                <td className="p-4 text-choco">
                  <Link href={`/admin/customers/${c.id}`} className="font-medium hover:text-berry-deep">
                    {c.name ?? "—"}
                  </Link>
                </td>
                <td className="p-4 text-choco-soft">{c.email}</td>
                <td className="p-4 text-choco-soft">
                  {c.enrollments.map((e) => e.tariff.name).join(", ") || "—"}
                </td>
                <td className="p-4 text-choco-soft">
                  {c.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {c.tags.map((t) => (
                        <span key={t} className="rounded-full bg-blush/60 px-2 py-0.5 text-xs text-berry-deep">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-4 text-choco-soft">{c.createdAt.toLocaleDateString("ru-RU")}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="rounded-full border border-beige-line px-3 py-1.5 text-xs font-semibold text-choco-soft transition hover:bg-white"
                    >
                      Открыть
                    </Link>
                    <ImpersonateButton userId={c.id} />
                  </div>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-choco-soft">
                  Ничего не найдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

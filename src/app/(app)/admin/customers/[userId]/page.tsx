import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ImpersonateButton } from "@/components/admin/ImpersonateButton";
import { TagEditor } from "@/components/admin/TagEditor";
import { AddNoteForm } from "@/components/admin/AddNoteForm";
import { ResetPasswordButton } from "@/components/admin/ResetPasswordButton";
import { SendEmailForm } from "@/components/admin/SendEmailForm";
import { RefundButton } from "@/components/admin/RefundButton";

type TimelineEntry = { date: Date; kind: string; label: string; detail?: string };

export default async function AdminCustomerDetailPage(ctx: PageProps<"/admin/customers/[userId]">) {
  await requireAdmin();
  const { userId } = await ctx.params;

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { enrollments: { include: { tariff: true } } },
  });
  if (!user || user.role !== "CUSTOMER") notFound();

  const [orders, loginEvents, notes, auditLog] = await Promise.all([
    db.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { tariff: true, coupon: true, refunds: true },
    }),
    db.loginEvent.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 }),
    db.customerNote.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { author: true } }),
    db.adminAuditLog.findMany({ where: { targetUserId: userId }, orderBy: { createdAt: "desc" }, take: 30, include: { admin: true } }),
  ]);

  const timeline: TimelineEntry[] = [
    { date: user.createdAt, kind: "account", label: "Аккаунт создан" },
    ...orders.map((o) => ({
      date: o.createdAt,
      kind: "order",
      label: `Заказ: ${o.tariff.name} — ${o.amount.toLocaleString("ru-RU")} ₽`,
      detail: o.status,
    })),
    ...orders.filter((o) => o.paidAt).map((o) => ({
      date: o.paidAt as Date,
      kind: "payment",
      label: `Оплата получена — ${o.tariff.name}`,
    })),
    ...orders.flatMap((o) =>
      o.refunds.map((r) => ({
        date: r.createdAt,
        kind: "refund",
        label: `Возврат ${r.amount.toLocaleString("ru-RU")} ₽`,
        detail: r.reason ?? undefined,
      }))
    ),
    ...loginEvents.map((l) => ({ date: l.createdAt, kind: "login", label: "Вход в аккаунт", detail: l.ip ?? undefined })),
    ...notes.map((n) => ({ date: n.createdAt, kind: "note", label: `Заметка от ${n.author.name ?? n.author.email}`, detail: n.body })),
    ...auditLog.map((a) => ({
      date: a.createdAt,
      kind: "admin",
      label: `Действие администратора: ${a.action}`,
      detail: a.admin.name ?? a.admin.email,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const icons: Record<string, string> = {
    account: "👤",
    order: "🛒",
    payment: "💳",
    refund: "↩️",
    login: "🔑",
    note: "📝",
    admin: "🛠️",
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/customers" className="text-xs text-choco-soft hover:text-berry-deep">
            ← Все клиенты
          </Link>
          <h1 className="mt-1 font-display text-2xl font-bold text-choco sm:text-3xl">{user.name ?? user.email}</h1>
          <p className="text-sm text-choco-soft">{user.email}</p>
        </div>
        <ImpersonateButton userId={user.id} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section className="rounded-3xl border border-beige-line bg-white/60 p-6">
            <h2 className="font-display text-lg font-bold text-choco">Покупки</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-beige-line text-left text-xs uppercase text-choco-soft">
                    <th className="pb-2 pr-4">Тариф</th>
                    <th className="pb-2 pr-4">Сумма</th>
                    <th className="pb-2 pr-4">Купон</th>
                    <th className="pb-2 pr-4">Статус</th>
                    <th className="pb-2 pr-4">Дата</th>
                    <th className="pb-2">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-beige-line/60 last:border-0">
                      <td className="py-2.5 pr-4 text-choco">{o.tariff.name}</td>
                      <td className="py-2.5 pr-4 text-choco-soft">{o.amount.toLocaleString("ru-RU")} ₽</td>
                      <td className="py-2.5 pr-4 text-choco-soft">{o.coupon?.code ?? "—"}</td>
                      <td className="py-2.5 pr-4">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="py-2.5 pr-4 text-choco-soft">{o.createdAt.toLocaleDateString("ru-RU")}</td>
                      <td className="py-2.5">
                        {o.status === "PAID" && <RefundButton orderId={o.id} />}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-choco-soft">
                        Пока нет заказов
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl border border-beige-line bg-white/60 p-6">
            <h2 className="font-display text-lg font-bold text-choco">Таймлайн</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {timeline.slice(0, 40).map((entry, i) => (
                <li key={i} className="flex gap-3 border-b border-beige-line/60 pb-3 text-sm last:border-0">
                  <span aria-hidden>{icons[entry.kind] ?? "•"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-choco">{entry.label}</p>
                    {entry.detail && <p className="truncate text-xs text-choco-soft">{entry.detail}</p>}
                  </div>
                  <span className="shrink-0 text-xs text-choco-soft">
                    {entry.date.toLocaleDateString("ru-RU")}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-beige-line bg-white/60 p-6">
            <h2 className="font-display text-lg font-bold text-choco">Заметки</h2>
            <div className="mt-4">
              <AddNoteForm userId={user.id} />
            </div>
            <ul className="mt-5 flex flex-col gap-3">
              {notes.map((n) => (
                <li key={n.id} className="rounded-2xl border border-beige-line/60 p-4 text-sm">
                  <p className="text-choco">{n.body}</p>
                  <p className="mt-2 text-xs text-choco-soft">
                    {n.author.name ?? n.author.email} · {n.createdAt.toLocaleString("ru-RU")}
                  </p>
                </li>
              ))}
              {notes.length === 0 && <p className="text-sm text-choco-soft">Заметок пока нет</p>}
            </ul>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-3xl border border-beige-line bg-white/60 p-6">
            <h2 className="font-display text-lg font-bold text-choco">Теги</h2>
            <div className="mt-4">
              <TagEditor userId={user.id} initialTags={user.tags} />
            </div>
          </section>

          <section className="rounded-3xl border border-beige-line bg-white/60 p-6">
            <h2 className="font-display text-lg font-bold text-choco">Тарифы</h2>
            <ul className="mt-3 flex flex-col gap-1.5 text-sm text-choco-soft">
              {user.enrollments.map((e) => (
                <li key={e.id}>{e.tariff.name}</li>
              ))}
              {user.enrollments.length === 0 && <li>Нет активных тарифов</li>}
            </ul>
          </section>

          <section className="rounded-3xl border border-beige-line bg-white/60 p-6">
            <h2 className="font-display text-lg font-bold text-choco">История входов</h2>
            <ul className="mt-3 flex flex-col gap-2 text-xs text-choco-soft">
              {loginEvents.map((l) => (
                <li key={l.id} className="flex justify-between border-b border-beige-line/60 pb-2 last:border-0">
                  <span>{l.ip ?? "—"}</span>
                  <span>{l.createdAt.toLocaleString("ru-RU")}</span>
                </li>
              ))}
              {loginEvents.length === 0 && <li>Ещё не входил(а)</li>}
            </ul>
          </section>

          <section className="rounded-3xl border border-beige-line bg-white/60 p-6">
            <h2 className="font-display text-lg font-bold text-choco">Действия</h2>
            <div className="mt-4 flex flex-col gap-4">
              <ResetPasswordButton userId={user.id} />
              <div className="border-t border-beige-line pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-choco-soft">
                  Написать клиенту
                </p>
                <SendEmailForm userId={user.id} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

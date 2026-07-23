import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { tariffs } from "@/lib/content/product";
import { getEffectiveUserId } from "@/lib/impersonation";

export default async function UpgradePage() {
  const session = await auth();
  const { userId } = await getEffectiveUserId(session!);
  const enrollments = await db.enrollment.findMany({
    where: { userId },
    include: { tariff: true },
  });
  const ownedMaxPrice = Math.max(0, ...enrollments.map((e) => e.tariff.price));
  const available = tariffs.filter((t) => t.price > ownedMaxPrice);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-berry-deep">Апгрейд</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-choco sm:text-3xl">
          Откройте больше возможностей
        </h1>
      </div>

      {available.length === 0 ? (
        <p className="text-sm text-choco-soft">У вас уже открыт максимальный тариф — спасибо!</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {available.map((t) => (
            <div key={t.id} className="rounded-3xl border border-blush-deep/50 bg-white/60 p-6">
              <h2 className="font-display text-xl font-bold text-choco">{t.name}</h2>
              <p className="mt-1 text-sm text-choco-soft">{t.description}</p>
              <p className="mt-3 font-display text-2xl font-extrabold text-choco">
                {t.price.toLocaleString("ru-RU")} ₽
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-choco-soft">
                    <span className="text-berry-deep">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/#pricing"
                className="mt-5 inline-flex rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
              >
                Перейти к оплате →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

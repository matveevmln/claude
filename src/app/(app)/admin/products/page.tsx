import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { CreateProductForm } from "@/components/admin/CreateProductForm";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { tariffs: true, modules: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-choco sm:text-3xl">Продукты</h1>
          <p className="mt-1 text-sm text-choco-soft">
            Курсы, электронные книги, шаблоны, подписки — новый продукт создаётся здесь, без правки кода.
          </p>
        </div>
        <CreateProductForm />
      </div>

      <div className="flex flex-col gap-3">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/admin/products/${p.id}`}
            className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-beige-line bg-white/60 p-5 transition hover:border-blush-deep hover:bg-white"
          >
            <div>
              <p className="font-display text-lg font-bold text-choco">
                {p.name} {!p.active && <span className="ml-2 text-xs font-normal text-choco-soft">(неактивен)</span>}
              </p>
              <p className="text-xs text-choco-soft">
                /{p.slug} · {p.type} · {p.tariffs.length} тарифов · {p.modules.length} модулей
              </p>
            </div>
            <span className="text-berry-deep">Открыть →</span>
          </Link>
        ))}
        {products.length === 0 && <p className="text-sm text-choco-soft">Пока нет продуктов</p>}
      </div>
    </div>
  );
}

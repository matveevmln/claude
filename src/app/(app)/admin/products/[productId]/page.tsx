import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { ProductFieldsForm } from "@/components/admin/ProductFieldsForm";
import { CatalogManager } from "@/components/admin/CatalogManager";

export default async function AdminProductDetailPage(ctx: PageProps<"/admin/products/[productId]">) {
  await requireAdmin();
  const { productId } = await ctx.params;

  const product = await db.product.findUnique({
    where: { id: productId },
    include: {
      tariffs: { orderBy: { price: "asc" } },
      modules: {
        orderBy: { index: "asc" },
        include: {
          lessons: { orderBy: { index: "asc" }, include: { resources: true } },
          tariffAccess: true,
        },
      },
    },
  });
  if (!product) notFound();

  const modules = product.modules.map((m) => ({
    id: m.id,
    index: m.index,
    title: m.title,
    subtitle: m.subtitle,
    lessons: m.lessons,
    tariffIds: m.tariffAccess.map((a) => a.tariffId),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/products" className="text-xs text-choco-soft hover:text-berry-deep">
          ← Все продукты
        </Link>
        <h1 className="mt-1 font-display text-2xl font-bold text-choco sm:text-3xl">{product.name}</h1>
        <p className="text-sm text-choco-soft">/{product.slug} · {product.type}</p>
      </div>

      <ProductFieldsForm
        productId={product.id}
        initialName={product.name}
        initialDescription={product.description ?? ""}
        initialActive={product.active}
      />

      <CatalogManager productId={product.id} tariffs={product.tariffs} modules={modules} />
    </div>
  );
}

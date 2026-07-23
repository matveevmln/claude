import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { tariffs, modules } from "../src/lib/content/product";
import { site } from "../src/config/site";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  const product = await db.product.upsert({
    where: { slug: site.primaryProductSlug },
    update: { name: site.productName },
    create: {
      slug: site.primaryProductSlug,
      name: site.productName,
      type: "course",
      description: site.productTagline,
    },
  });

  const tariffRows = new Map<string, string>();
  for (const t of tariffs) {
    const row = await db.tariff.upsert({
      where: { productId_slug: { productId: product.id, slug: t.id } },
      update: { name: t.name, price: t.price, oldPrice: t.oldPrice, badge: t.badge, features: t.features },
      create: {
        productId: product.id,
        slug: t.id,
        name: t.name,
        price: t.price,
        oldPrice: t.oldPrice,
        badge: t.badge,
        features: t.features,
      },
    });
    tariffRows.set(t.id, row.id);
  }

  // Tariff access: basic unlocks modules 1-3, standard unlocks 1-6, vip unlocks all 8.
  const accessByModule = (index: number) => {
    const ids = [tariffRows.get("vip")!];
    if (index <= 6) ids.push(tariffRows.get("standard")!);
    if (index <= 3) ids.push(tariffRows.get("basic")!);
    return ids;
  };

  for (const m of modules) {
    const moduleRow = await db.module.upsert({
      where: { productId_index: { productId: product.id, index: m.index } },
      update: { title: m.title, subtitle: m.subtitle },
      create: { productId: product.id, index: m.index, title: m.title, subtitle: m.subtitle },
    });

    for (const tariffId of accessByModule(m.index)) {
      await db.moduleTariffAccess.upsert({
        where: { moduleId_tariffId: { moduleId: moduleRow.id, tariffId } },
        update: {},
        create: { moduleId: moduleRow.id, tariffId },
      });
    }

    for (const [i, title] of m.lessons.entries()) {
      await db.lesson.upsert({
        where: { moduleId_index: { moduleId: moduleRow.id, index: i + 1 } },
        update: { title },
        create: { moduleId: moduleRow.id, index: i + 1, title },
      });
    }
  }

  console.log(`Seeded product "${product.name}" with ${tariffs.length} tariffs and ${modules.length} modules.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

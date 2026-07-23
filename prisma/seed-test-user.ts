import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/lib/password";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  const tariff = await db.tariff.findFirstOrThrow({ where: { slug: "standard" } });
  const passwordHash = await hashPassword("Test12345");

  const user = await db.user.upsert({
    where: { email: "test@example.com" },
    update: { passwordHash },
    create: {
      email: "test@example.com",
      name: "Тест Тестова",
      passwordHash,
      emailVerified: new Date(),
    },
  });

  await db.enrollment.upsert({
    where: { userId_tariffId: { userId: user.id, tariffId: tariff.id } },
    update: {},
    create: { userId: user.id, tariffId: tariff.id },
  });

  // Complete one lesson so dashboard progress isn't 0%.
  const firstLesson = await db.lesson.findFirstOrThrow({
    where: { module: { index: 1 } },
    orderBy: { index: "asc" },
  });
  await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId: firstLesson.id } },
    update: { completed: true, completedAt: new Date() },
    create: { userId: user.id, lessonId: firstLesson.id, completed: true, completedAt: new Date() },
  });

  console.log("Test user ready:", user.email, "password: Test12345");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

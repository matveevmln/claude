// Usage: npx tsx prisma/make-admin.ts someone@example.com
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npx tsx prisma/make-admin.ts someone@example.com");
    process.exit(1);
  }

  const user = await db.user.update({
    where: { email: email.toLowerCase() },
    data: { role: "ADMIN" },
  });
  console.log(`${user.email} is now ADMIN.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

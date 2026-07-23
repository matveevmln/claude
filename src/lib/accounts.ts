import { db } from "@/lib/db";
import { generateTempPassword, hashPassword } from "@/lib/password";
import { site } from "@/config/site";

type ProvisionInput = {
  email: string;
  name?: string;
  tariffSlug: string;
  orderId: string;
  productSlug?: string;
};

type ProvisionResult = {
  userId: string;
  isNewAccount: boolean;
  tempPassword?: string;
};

/**
 * Called from the payment webhook once a payment is confirmed. Idempotent:
 * safe to call more than once for the same order (webhook retries) without
 * creating duplicate users, enrollments, or re-issuing a password email.
 */
export async function provisionCustomerAccount({
  email,
  name,
  tariffSlug,
  orderId,
  productSlug = site.primaryProductSlug,
}: ProvisionInput): Promise<ProvisionResult> {
  const normalizedEmail = email.trim().toLowerCase();

  const tariff = await db.tariff.findFirstOrThrow({
    where: { slug: tariffSlug, product: { slug: productSlug } },
  });

  let user = await db.user.findUnique({ where: { email: normalizedEmail } });
  let tempPassword: string | undefined;
  let isNewAccount = false;

  if (!user) {
    tempPassword = generateTempPassword();
    const passwordHash = await hashPassword(tempPassword);
    user = await db.user.create({
      data: {
        email: normalizedEmail,
        name,
        passwordHash,
        emailVerified: new Date(), // trusted: verified by successful payment on this email
      },
    });
    isNewAccount = true;
  }

  await db.enrollment.upsert({
    where: { userId_tariffId: { userId: user.id, tariffId: tariff.id } },
    update: { orderId },
    create: { userId: user.id, tariffId: tariff.id, orderId },
  });

  await db.order.update({
    where: { id: orderId },
    data: { userId: user.id },
  });

  await db.notification.create({
    data: {
      userId: user.id,
      title: "Добро пожаловать в «Дом Десертов»!",
      body: `Тариф «${tariff.name}» открыт. Начните с первого модуля в личном кабинете.`,
    },
  });

  return { userId: user.id, isNewAccount, tempPassword };
}

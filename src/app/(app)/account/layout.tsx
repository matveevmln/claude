import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getEffectiveUserId } from "@/lib/impersonation";
import { AccountShell } from "@/components/account/AccountShell";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const { userId, isImpersonating } = await getEffectiveUserId(session!);

  const [impersonating, affiliate] = await Promise.all([
    isImpersonating ? db.user.findUnique({ where: { id: userId }, select: { name: true, email: true } }) : null,
    db.affiliatePartner.findUnique({ where: { userId }, select: { id: true } }),
  ]);

  return (
    <AccountShell
      impersonating={impersonating ? { name: impersonating.name, email: impersonating.email } : null}
      isAffiliate={!!affiliate}
    >
      {children}
    </AccountShell>
  );
}

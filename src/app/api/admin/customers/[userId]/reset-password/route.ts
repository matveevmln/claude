import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/requireAdmin";
import { isTrustedOrigin } from "@/lib/security";
import { generateTempPassword, hashPassword } from "@/lib/password";
import { sendEmail } from "@/lib/email/send";
import { manualPasswordResetEmail } from "@/lib/email/templates/transactional";

export async function POST(request: NextRequest, ctx: RouteContext<"/api/admin/customers/[userId]/reset-password">) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await ctx.params;
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const tempPassword = generateTempPassword();
  await db.user.update({ where: { id: userId }, data: { passwordHash: await hashPassword(tempPassword) } });

  await db.adminAuditLog.create({
    data: { adminId: session.user.id, action: "manual_password_reset", targetUserId: userId },
  });

  const { subject, html, text } = manualPasswordResetEmail({ name: user.name ?? "друг", tempPassword });
  await sendEmail({ to: user.email, subject, html, text });

  return NextResponse.json({ ok: true, tempPassword });
}

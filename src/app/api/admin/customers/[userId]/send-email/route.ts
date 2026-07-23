import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/requireAdmin";
import { isTrustedOrigin } from "@/lib/security";
import { sendEmail } from "@/lib/email/send";
import { adminMessageEmail } from "@/lib/email/templates/transactional";

const schema = z.object({
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
});

export async function POST(request: NextRequest, ctx: RouteContext<"/api/admin/customers/[userId]/send-email">) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await ctx.params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Bad request" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { subject, message } = parsed.data;
  const { html, text } = adminMessageEmail({ name: user.name ?? "друг", subject, message });
  await sendEmail({ to: user.email, subject, html, text });

  await db.adminAuditLog.create({
    data: { adminId: session.user.id, action: "manual_email", targetUserId: userId, payload: { subject } },
  });

  return NextResponse.json({ ok: true });
}

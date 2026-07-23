import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/requireAdmin";
import { isTrustedOrigin } from "@/lib/security";
import { setImpersonationCookie } from "@/lib/impersonation";

const schema = z.object({ userId: z.string().min(1) });

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Bad request" }, { status: 400 });
  }

  const target = await db.user.findUnique({ where: { id: parsed.data.userId } });
  if (!target || target.role !== "CUSTOMER") {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await setImpersonationCookie(target.id);

  await db.adminAuditLog.create({
    data: {
      adminId: session.user.id,
      action: "impersonate_start",
      targetUserId: target.id,
    },
  });

  return NextResponse.json({ ok: true });
}

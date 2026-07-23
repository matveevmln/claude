import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/requireAdmin";
import { isTrustedOrigin } from "@/lib/security";
import { clearImpersonationCookie } from "@/lib/impersonation";

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await clearImpersonationCookie();

  await db.adminAuditLog.create({
    data: {
      adminId: session.user.id,
      action: "impersonate_stop",
    },
  });

  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/requireAdmin";
import { isTrustedOrigin } from "@/lib/security";

export async function DELETE(request: NextRequest, ctx: RouteContext<"/api/admin/announcements/[announcementId]">) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await requireAdminApi())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { announcementId } = await ctx.params;
  await db.announcement.delete({ where: { id: announcementId } });
  return NextResponse.json({ ok: true });
}

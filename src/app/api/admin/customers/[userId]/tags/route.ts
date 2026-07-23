import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/requireAdmin";
import { isTrustedOrigin } from "@/lib/security";

const schema = z.object({ tags: z.array(z.string().min(1).max(40)).max(20) });

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/admin/customers/[userId]/tags">) {
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

  const tags = Array.from(new Set(parsed.data.tags.map((t) => t.trim()).filter(Boolean)));
  await db.user.update({ where: { id: userId }, data: { tags } });

  await db.adminAuditLog.create({
    data: { adminId: session.user.id, action: "update_tags", targetUserId: userId, payload: { tags } },
  });

  return NextResponse.json({ ok: true, tags });
}

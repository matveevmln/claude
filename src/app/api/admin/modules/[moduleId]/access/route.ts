import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/requireAdmin";
import { isTrustedOrigin } from "@/lib/security";

const schema = z.object({ tariffId: z.string().min(1), granted: z.boolean() });

/** Toggles whether a tariff unlocks this module. */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/admin/modules/[moduleId]/access">) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { moduleId } = await ctx.params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Bad request" }, { status: 400 });
  }

  const { tariffId, granted } = parsed.data;

  if (granted) {
    await db.moduleTariffAccess.upsert({
      where: { moduleId_tariffId: { moduleId, tariffId } },
      update: {},
      create: { moduleId, tariffId },
    });
  } else {
    await db.moduleTariffAccess.deleteMany({ where: { moduleId, tariffId } });
  }

  await db.adminAuditLog.create({
    data: { adminId: session.user.id, action: "update_module_access", payload: { moduleId, tariffId, granted } },
  });

  return NextResponse.json({ ok: true });
}

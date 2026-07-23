import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/requireAdmin";
import { isTrustedOrigin } from "@/lib/security";

const schema = z.object({ body: z.string().min(1).max(2000) });

export async function POST(request: NextRequest, ctx: RouteContext<"/api/admin/customers/[userId]/notes">) {
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

  const note = await db.customerNote.create({
    data: { userId, authorId: session.user.id, body: parsed.data.body },
    include: { author: { select: { name: true, email: true } } },
  });

  return NextResponse.json({ ok: true, note });
}

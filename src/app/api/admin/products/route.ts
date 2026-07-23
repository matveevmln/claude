import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/requireAdmin";
import { isTrustedOrigin } from "@/lib/security";

const schema = z.object({
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/, "Только латиница, цифры и дефисы"),
  name: z.string().min(2).max(200),
  type: z.string().min(1).max(40).default("course"),
  description: z.string().max(2000).optional(),
});

export async function GET() {
  if (!(await requireAdminApi())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const products = await db.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ products });
}

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

  const existing = await db.product.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "Продукт с таким slug уже существует" }, { status: 400 });
  }

  const product = await db.product.create({ data: parsed.data });

  await db.adminAuditLog.create({
    data: { adminId: session.user.id, action: "create_product", payload: { productId: product.id, slug: product.slug } },
  });

  return NextResponse.json({ ok: true, product });
}

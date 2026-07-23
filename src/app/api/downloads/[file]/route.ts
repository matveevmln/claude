import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getEffectiveUserId } from "@/lib/impersonation";

const ALLOWED_FILES: Record<string, string> = {
  "recipe-book.pdf": "01-recipe-book.pdf",
  "tech-cards.pdf": "02-tech-cards.pdf",
  "checklists.pdf": "03-checklists.pdf",
};

// Not under `public/`, so Next.js never serves it directly — only via this
// auth-gated route. Source of truth for these files is `product/pdf/`.
const DOWNLOADS_DIR = path.join(process.cwd(), "product", "pdf");

export async function GET(request: NextRequest, ctx: RouteContext<"/api/downloads/[file]">) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  const { userId } = await getEffectiveUserId(session);
  const enrollment = await db.enrollment.findFirst({ where: { userId } });
  if (!enrollment) {
    return NextResponse.json({ error: "Нет активной покупки" }, { status: 403 });
  }

  const { file } = await ctx.params;
  const diskName = ALLOWED_FILES[file];
  if (!diskName) {
    return NextResponse.json({ error: "Файл не найден" }, { status: 404 });
  }

  const buffer = await readFile(path.join(DOWNLOADS_DIR, diskName));
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${diskName}"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}

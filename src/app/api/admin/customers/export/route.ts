import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/requireAdmin";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET() {
  if (!(await requireAdminApi())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const customers = await db.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: { enrollments: { include: { tariff: true } } },
  });

  const header = ["ID", "Имя", "Email", "Тарифы", "Теги", "Telegram", "Дата регистрации"];
  const rows = customers.map((c) => [
    c.id,
    c.name ?? "",
    c.email,
    c.enrollments.map((e) => e.tariff.name).join("; "),
    c.tags.join("; "),
    c.telegramUsername ?? "",
    c.createdAt.toISOString(),
  ]);

  const csv = [header, ...rows].map((row) => row.map((cell) => csvEscape(String(cell))).join(",")).join("\n");
  const bom = "﻿"; // Excel-friendly UTF-8 BOM for Cyrillic text

  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="customers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

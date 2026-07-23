import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { generateToken } from "@/lib/password";
import { sendEmail } from "@/lib/email/send";
import { passwordResetEmail } from "@/lib/email/templates/transactional";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { site } from "@/config/site";

const schema = z.object({ email: z.string().email() });

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!rateLimit(`forgot-password:${ip}`, { windowMs: 15 * 60 * 1000, max: 5 })) {
    return NextResponse.json({ error: "Слишком много попыток. Попробуйте позже." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    // Still return 200 — don't leak validation details to enumerate accounts.
    return NextResponse.json({ ok: true });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const user = await db.user.findUnique({ where: { email } });

  // Always respond the same way whether or not the account exists.
  if (user) {
    const token = generateToken();
    await db.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
    });

    const resetUrl = `${site.domain}/reset-password?token=${token}`;
    const { subject, html, text } = passwordResetEmail({ name: user.name ?? "друг", resetUrl });
    await sendEmail({ to: user.email, subject, html, text });
  }

  return NextResponse.json({ ok: true });
}

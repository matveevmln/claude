"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { site } from "@/config/site";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    // Always show success — don't reveal whether the email exists.
    setSent(true);
    setLoading(false);
  }

  return (
    <main id="main-content" className="flex min-h-screen items-center justify-center bg-cream px-5 py-16">
      <div className="w-full max-w-sm rounded-[2rem] border border-beige-line bg-white/70 p-8 shadow-xl">
        <div className="mb-6 text-center">
          <p className="font-display text-lg font-bold text-choco">{site.brand}</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-choco">Восстановление пароля</h1>
        </div>

        {sent ? (
          <p className="text-center text-sm text-choco-soft">
            Если такой email зарегистрирован, мы отправили на него ссылку для сброса пароля.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-choco-soft">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-beige-line bg-white px-4 py-3 text-sm outline-none focus:border-berry"
              />
            </label>
            <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
              {loading ? "Отправляем…" : "Отправить ссылку"}
            </Button>
          </form>
        )}

        <div className="mt-5 text-center text-xs text-choco-soft">
          <Link href="/login" className="hover:text-berry-deep">
            ← Назад ко входу
          </Link>
        </div>
      </div>
    </main>
  );
}

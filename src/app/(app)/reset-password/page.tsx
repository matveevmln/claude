"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { site } from "@/config/site";
import { Button } from "@/components/ui/Button";

function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    if (res.ok) {
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Не удалось сбросить пароль");
    }
    setLoading(false);
  }

  return (
    <main id="main-content" className="flex min-h-screen items-center justify-center bg-cream px-5 py-16">
      <div className="w-full max-w-sm rounded-[2rem] border border-beige-line bg-white/70 p-8 shadow-xl">
        <div className="mb-6 text-center">
          <p className="font-display text-lg font-bold text-choco">{site.brand}</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-choco">Новый пароль</h1>
        </div>

        {done ? (
          <p className="text-center text-sm text-choco-soft">Пароль обновлён — переходим ко входу…</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-choco-soft">Новый пароль</span>
              <input
                required
                type="password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-beige-line bg-white px-4 py-3 text-sm outline-none focus:border-berry"
              />
            </label>
            {error && (
              <p role="alert" className="text-sm font-medium text-berry-deep">
                {error}
              </p>
            )}
            <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
              {loading ? "Сохраняем…" : "Сохранить пароль"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

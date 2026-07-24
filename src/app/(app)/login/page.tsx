"use client";

import { FormEvent, Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { site } from "@/config/site";
import { Button } from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setError("Неверный email или пароль. Проверьте данные из письма после оплаты.");
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <main id="main-content" className="flex min-h-screen items-center justify-center bg-cream px-5 py-16">
      <div className="w-full max-w-sm rounded-[2rem] border border-beige-line bg-white/70 p-8 shadow-xl">
        <div className="mb-6 text-center">
          <p className="font-display text-lg font-bold text-choco">{site.brand}</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-choco">Вход в личный кабинет</h1>
          <p className="mt-1 text-sm text-choco-soft">
            Используйте email и пароль из письма после оплаты
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-choco-soft">Email</span>
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-beige-line bg-white px-4 py-3 text-sm outline-none focus:border-berry"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-choco-soft">Пароль</span>
            <input
              required
              type="password"
              autoComplete="current-password"
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
            {loading ? "Входим…" : "Войти"}
          </Button>
        </form>

        <div className="mt-5 flex flex-col items-center gap-2 text-xs text-choco-soft">
          <Link href="/forgot-password" className="hover:text-berry-deep">
            Забыли пароль?
          </Link>
          <Link href="/" className="hover:text-berry-deep">
            ← Вернуться на сайт
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

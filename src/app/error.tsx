"use client";

import { useEffect } from "react";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[error-boundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-5 text-center">
      <p className="text-4xl" aria-hidden>
        😕
      </p>
      <h1 className="font-display text-2xl font-bold text-choco">Что-то пошло не так</h1>
      <p className="max-w-sm text-sm text-choco-soft">
        Мы уже знаем об ошибке. Попробуйте обновить страницу — если не поможет, напишите нам в поддержку.
      </p>
      <button
        onClick={reset}
        className="mt-2 rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
      >
        Попробовать снова
      </button>
    </div>
  );
}

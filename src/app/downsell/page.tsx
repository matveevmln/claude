import Link from "next/link";

export default function DownsellPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5 py-16">
      <div className="w-full max-w-lg rounded-[2.5rem] border border-beige-line bg-white p-8 text-center shadow-xl sm:p-10">
        <h1 className="font-display text-2xl font-bold text-choco sm:text-3xl">Не готовы к полному курсу?</h1>
        <p className="mt-3 text-sm text-choco-soft">
          Начните с тарифа «Базовый» — 8 модулей и PDF-книга рецептов, чтобы попробовать формат без большого вложения.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/#pricing"
            className="rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
          >
            Посмотреть тарифы
          </Link>
          <Link href="/login" className="rounded-full border border-beige-line px-6 py-3.5 text-sm font-bold text-choco">
            В личный кабинет
          </Link>
        </div>
      </div>
    </div>
  );
}

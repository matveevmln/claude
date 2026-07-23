import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-5 text-center">
      <p className="text-4xl" aria-hidden>
        🍰
      </p>
      <h1 className="font-display text-2xl font-bold text-choco">Страница не найдена</h1>
      <p className="max-w-sm text-sm text-choco-soft">
        Похоже, такой страницы не существует или она была перемещена.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
      >
        На главную
      </Link>
    </div>
  );
}

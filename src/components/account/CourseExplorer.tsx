"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Lesson = {
  id: string;
  index: number;
  title: string;
  completed: boolean;
};

type ModuleWithAccess = {
  id: string;
  index: number;
  title: string;
  subtitle: string | null;
  unlocked: boolean;
  lessons: Lesson[];
  completedCount: number;
  totalCount: number;
};

const FAVORITES_KEY = "dd_favorite_lessons";

export function CourseExplorer({ modules }: { modules: ModuleWithAccess[] }) {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) ?? "[]");
      // One-time read of an external store (localStorage) on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFavorites(new Set(stored));
    } catch {
      // ignore malformed storage
    }
  }, []);

  function toggleFavorite(lessonId: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId);
      else next.add(lessonId);
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  const filteredModules = useMemo(() => {
    const q = query.trim().toLowerCase();
    return modules
      .map((m) => ({
        ...m,
        lessons: m.lessons.filter((l) => {
          if (showFavoritesOnly && !favorites.has(l.id)) return false;
          if (q && !l.title.toLowerCase().includes(q) && !m.title.toLowerCase().includes(q)) return false;
          return true;
        }),
      }))
      .filter((m) => m.lessons.length > 0 || (!query && !showFavoritesOnly));
  }, [modules, query, showFavoritesOnly, favorites]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Искать урок по названию…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-beige-line bg-white px-4 py-2.5 text-sm outline-none focus:border-berry sm:max-w-xs"
        />
        <button
          onClick={() => setShowFavoritesOnly((v) => !v)}
          className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
            showFavoritesOnly
              ? "border-berry-deep bg-blush text-berry-deep"
              : "border-beige-line text-choco-soft hover:bg-white"
          }`}
        >
          ★ Избранное
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {filteredModules.map((m) => (
          <ModuleCard key={m.id} module={m} favorites={favorites} onToggleFavorite={toggleFavorite} />
        ))}
      </div>
    </div>
  );
}

function ModuleCard({
  module: m,
  favorites,
  onToggleFavorite,
}: {
  module: ModuleWithAccess;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}) {
  const [open, setOpen] = useState(m.index === 1);

  return (
    <div
      className={`overflow-hidden rounded-3xl border ${
        m.unlocked ? "border-beige-line bg-white/60" : "border-beige-line bg-beige/30"
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="flex items-center gap-4">
          <span className="font-display text-lg font-extrabold text-berry-deep">
            {String(m.index).padStart(2, "0")}
          </span>
          <span>
            <span className="block font-display font-bold text-choco">
              {m.title} {!m.unlocked && <span className="text-xs">🔒</span>}
            </span>
            {m.unlocked && (
              <span className="block text-xs text-choco-soft">
                {m.completedCount} из {m.totalCount} уроков пройдено
              </span>
            )}
          </span>
        </span>
        <span aria-hidden className="text-xl text-berry-deep">
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5">
          {!m.unlocked ? (
            <div className="rounded-2xl border border-gold-light/60 bg-gradient-to-r from-gold-light/15 to-blush/30 p-4">
              <p className="text-sm font-semibold text-choco">Этот модуль доступен на тарифе выше</p>
              <Link
                href="/account/upgrade"
                className="mt-2 inline-flex text-xs font-bold text-gold-deep underline"
              >
                Посмотреть варианты апгрейда →
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-1">
              {m.lessons.map((l) => (
                <li key={l.id} className="flex items-center gap-2">
                  <Link
                    href={`/account/course/${l.id}`}
                    className="flex flex-1 items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-choco transition hover:bg-white"
                  >
                    <span aria-hidden>{l.completed ? "✅" : "▶️"}</span>
                    {l.title}
                  </Link>
                  <button
                    onClick={() => onToggleFavorite(l.id)}
                    aria-label={favorites.has(l.id) ? "Убрать из избранного" : "Добавить в избранное"}
                    aria-pressed={favorites.has(l.id)}
                    className={`px-2 text-lg ${favorites.has(l.id) ? "text-gold-deep" : "text-beige-line"}`}
                  >
                    ★
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

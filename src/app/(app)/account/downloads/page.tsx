const files = [
  {
    href: "/api/downloads/recipe-book.pdf",
    title: "PDF-книга «120 проверенных рецептов»",
    description: "22 полных рецепта и техники по всем 8 модулям курса",
    icon: "📖",
  },
  {
    href: "/api/downloads/tech-cards.pdf",
    title: "Технологические карты",
    description: "Температура, время и заметки по каждому этапу",
    icon: "📋",
  },
  {
    href: "/api/downloads/checklists.pdf",
    title: "Чек-листы к урокам",
    description: "Что подготовить заранее по каждому модулю",
    icon: "✅",
  },
];

export default function DownloadsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-berry-deep">Центр загрузок</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-choco sm:text-3xl">Ваши материалы</h1>
      </div>

      <div className="flex flex-col gap-3">
        {files.map((f) => (
          <a
            key={f.href}
            href={f.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-beige-line bg-white/60 p-5 transition hover:border-blush-deep hover:bg-white"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blush text-2xl">
              {f.icon}
            </span>
            <span className="flex-1">
              <span className="block font-display font-bold text-choco">{f.title}</span>
              <span className="block text-sm text-choco-soft">{f.description}</span>
            </span>
            <span aria-hidden className="text-berry-deep">
              ↓
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

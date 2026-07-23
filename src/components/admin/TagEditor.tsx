"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TagEditor({ userId, initialTags }: { userId: string; initialTags: string[] }) {
  const router = useRouter();
  const [tags, setTags] = useState(initialTags);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(next: string[]) {
    setSaving(true);
    const res = await fetch(`/api/admin/customers/${userId}/tags`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags: next }),
    });
    if (res.ok) {
      setTags(next);
      router.refresh();
    }
    setSaving(false);
  }

  function addTag() {
    const value = input.trim();
    if (!value || tags.includes(value)) return;
    setInput("");
    void save([...tags, value]);
  }

  function removeTag(tag: string) {
    void save(tags.filter((t) => t !== tag));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span
            key={t}
            className="flex items-center gap-1.5 rounded-full bg-blush/60 px-3 py-1 text-xs font-medium text-berry-deep"
          >
            {t}
            <button onClick={() => removeTag(t)} aria-label={`Удалить тег ${t}`} className="hover:text-choco">
              ×
            </button>
          </span>
        ))}
        {tags.length === 0 && <span className="text-xs text-choco-soft">Нет тегов</span>}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder="Новый тег…"
          className="w-40 rounded-full border border-beige-line bg-white px-3 py-1.5 text-xs outline-none focus:border-berry"
        />
        <button
          onClick={addTag}
          disabled={saving || !input.trim()}
          className="rounded-full border border-beige-line px-3 py-1.5 text-xs font-semibold text-choco-soft transition hover:bg-white disabled:opacity-50"
        >
          Добавить
        </button>
      </div>
    </div>
  );
}

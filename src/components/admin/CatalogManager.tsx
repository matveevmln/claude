"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Tariff = {
  id: string;
  slug: string;
  name: string;
  price: number;
  oldPrice: number | null;
  badge: string | null;
  providerOfferId: string | null;
  active: boolean;
};

type Resource = { id: string; title: string; url: string; kind: string };

type Lesson = {
  id: string;
  index: number;
  title: string;
  summary: string | null;
  videoUrl: string | null;
  pdfUrl: string | null;
  durationSec: number | null;
  resources: Resource[];
};

type ModuleWithAccess = {
  id: string;
  index: number;
  title: string;
  subtitle: string | null;
  lessons: Lesson[];
  tariffIds: string[];
};

async function api(url: string, method: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? `Request failed (${res.status})`);
  }
  return res.json();
}

export function CatalogManager({
  productId,
  tariffs: initialTariffs,
  modules: initialModules,
}: {
  productId: string;
  tariffs: Tariff[];
  modules: ModuleWithAccess[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function run(fn: () => Promise<unknown>) {
    setBusy(true);
    try {
      await fn();
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="font-display text-lg font-bold text-choco">Тарифы</h2>
        <div className="mt-3 flex flex-col gap-3">
          {initialTariffs.map((t) => (
            <TariffRow key={t.id} tariff={t} disabled={busy} onSave={(data) => run(() => api(`/api/admin/tariffs/${t.id}`, "PATCH", data))} />
          ))}
          <NewTariffForm disabled={busy} onCreate={(data) => run(() => api(`/api/admin/products/${productId}/tariffs`, "POST", data))} />
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-bold text-choco">Модули и уроки</h2>
        <div className="mt-3 flex flex-col gap-4">
          {initialModules.map((m) => (
            <ModuleBlock
              key={m.id}
              module={m}
              tariffs={initialTariffs}
              disabled={busy}
              onSaveModule={(data) => run(() => api(`/api/admin/modules/${m.id}`, "PATCH", data))}
              onDeleteModule={() => {
                if (confirm(`Удалить модуль «${m.title}» со всеми уроками?`)) {
                  run(() => api(`/api/admin/modules/${m.id}`, "DELETE"));
                }
              }}
              onToggleAccess={(tariffId, granted) =>
                run(() => api(`/api/admin/modules/${m.id}/access`, "POST", { tariffId, granted }))
              }
              onCreateLesson={(data) => run(() => api(`/api/admin/modules/${m.id}/lessons`, "POST", data))}
              onSaveLesson={(lessonId, data) => run(() => api(`/api/admin/lessons/${lessonId}`, "PATCH", data))}
              onDeleteLesson={(lessonId, title) => {
                if (confirm(`Удалить урок «${title}»?`)) {
                  run(() => api(`/api/admin/lessons/${lessonId}`, "DELETE"));
                }
              }}
              onCreateResource={(lessonId, data) => run(() => api(`/api/admin/lessons/${lessonId}/resources`, "POST", data))}
              onDeleteResource={(resourceId) => run(() => api(`/api/admin/resources/${resourceId}`, "DELETE"))}
            />
          ))}
          <NewModuleForm
            disabled={busy}
            nextIndex={initialModules.length + 1}
            onCreate={(data) => run(() => api(`/api/admin/products/${productId}/modules`, "POST", data))}
          />
        </div>
      </section>
    </div>
  );
}

function TariffRow({
  tariff,
  disabled,
  onSave,
}: {
  tariff: Tariff;
  disabled: boolean;
  onSave: (data: Partial<Tariff>) => void;
}) {
  const [name, setName] = useState(tariff.name);
  const [price, setPrice] = useState(tariff.price);
  const [oldPrice, setOldPrice] = useState(tariff.oldPrice ?? 0);
  const [providerOfferId, setProviderOfferId] = useState(tariff.providerOfferId ?? "");
  const [active, setActive] = useState(tariff.active);

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-beige-line bg-white/60 p-4">
      <label className="flex flex-col gap-1 text-xs text-choco-soft">
        Название
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-40 rounded-xl border border-beige-line bg-white px-3 py-2 text-sm" />
      </label>
      <label className="flex flex-col gap-1 text-xs text-choco-soft">
        Цена
        <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-28 rounded-xl border border-beige-line bg-white px-3 py-2 text-sm" />
      </label>
      <label className="flex flex-col gap-1 text-xs text-choco-soft">
        Старая цена
        <input type="number" value={oldPrice} onChange={(e) => setOldPrice(Number(e.target.value))} className="w-28 rounded-xl border border-beige-line bg-white px-3 py-2 text-sm" />
      </label>
      <label className="flex flex-col gap-1 text-xs text-choco-soft">
        ID тарифа у платёжного провайдера
        <input
          value={providerOfferId}
          onChange={(e) => setProviderOfferId(e.target.value)}
          placeholder="offerId в Lava.top"
          className="w-48 rounded-xl border border-beige-line bg-white px-3 py-2 text-sm"
        />
      </label>
      <label className="flex items-center gap-1.5 text-xs text-choco-soft">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        Активен
      </label>
      <button
        disabled={disabled}
        onClick={() => onSave({ name, price, oldPrice: oldPrice || null, providerOfferId: providerOfferId || null, active })}
        className="rounded-full bg-choco px-4 py-2 text-xs font-semibold text-cream disabled:opacity-50"
      >
        Сохранить
      </button>
      <span className="text-xs text-choco-soft">/{tariff.slug}</span>
    </div>
  );
}

function NewTariffForm({ disabled, onCreate }: { disabled: boolean; onCreate: (data: Record<string, unknown>) => void }) {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);

  function submit(e: FormEvent) {
    e.preventDefault();
    onCreate({ slug, name, price, features: [] });
    setOpen(false);
    setSlug("");
    setName("");
    setPrice(0);
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="self-start text-xs font-semibold text-berry-deep hover:underline">
        + Добавить тариф
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-3 rounded-2xl border border-dashed border-beige-line p-4">
      <input placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase())} required className="w-32 rounded-xl border border-beige-line bg-white px-3 py-2 text-sm" />
      <input placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} required className="w-40 rounded-xl border border-beige-line bg-white px-3 py-2 text-sm" />
      <input type="number" placeholder="Цена" value={price} onChange={(e) => setPrice(Number(e.target.value))} required className="w-28 rounded-xl border border-beige-line bg-white px-3 py-2 text-sm" />
      <button disabled={disabled} type="submit" className="rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-4 py-2 text-xs font-bold text-white">
        Создать
      </button>
    </form>
  );
}

function ModuleBlock({
  module: m,
  tariffs,
  disabled,
  onSaveModule,
  onDeleteModule,
  onToggleAccess,
  onCreateLesson,
  onSaveLesson,
  onDeleteLesson,
  onCreateResource,
  onDeleteResource,
}: {
  module: ModuleWithAccess;
  tariffs: Tariff[];
  disabled: boolean;
  onSaveModule: (data: Partial<{ title: string; subtitle: string | null; index: number }>) => void;
  onDeleteModule: () => void;
  onToggleAccess: (tariffId: string, granted: boolean) => void;
  onCreateLesson: (data: Record<string, unknown>) => void;
  onSaveLesson: (lessonId: string, data: Record<string, unknown>) => void;
  onDeleteLesson: (lessonId: string, title: string) => void;
  onCreateResource: (lessonId: string, data: Record<string, unknown>) => void;
  onDeleteResource: (resourceId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(m.title);
  const [subtitle, setSubtitle] = useState(m.subtitle ?? "");

  return (
    <div className="rounded-3xl border border-beige-line bg-white/60">
      <div className="flex items-center justify-between gap-3 p-4">
        <button onClick={() => setOpen((v) => !v)} className="flex flex-1 items-center gap-3 text-left">
          <span className="font-display text-lg font-extrabold text-berry-deep">{String(m.index).padStart(2, "0")}</span>
          <span className="font-semibold text-choco">{m.title}</span>
          <span className="text-xs text-choco-soft">({m.lessons.length} уроков)</span>
        </button>
        <button onClick={onDeleteModule} disabled={disabled} className="text-xs text-choco-soft hover:text-berry-deep">
          Удалить модуль
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-4 border-t border-beige-line p-4">
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-xs text-choco-soft">
              Название
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-56 rounded-xl border border-beige-line bg-white px-3 py-2 text-sm" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-choco-soft">
              Подзаголовок
              <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-64 rounded-xl border border-beige-line bg-white px-3 py-2 text-sm" />
            </label>
            <button
              disabled={disabled}
              onClick={() => onSaveModule({ title, subtitle: subtitle || null })}
              className="rounded-full bg-choco px-4 py-2 text-xs font-semibold text-cream disabled:opacity-50"
            >
              Сохранить
            </button>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-choco-soft">Доступен на тарифах</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {tariffs.map((t) => (
                <label key={t.id} className="flex items-center gap-1.5 text-xs text-choco">
                  <input
                    type="checkbox"
                    checked={m.tariffIds.includes(t.id)}
                    onChange={(e) => onToggleAccess(t.id, e.target.checked)}
                    disabled={disabled}
                  />
                  {t.name}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {m.lessons.map((l) => (
              <LessonRow
                key={l.id}
                lesson={l}
                disabled={disabled}
                onSave={(data) => onSaveLesson(l.id, data)}
                onDelete={() => onDeleteLesson(l.id, l.title)}
                onCreateResource={(data) => onCreateResource(l.id, data)}
                onDeleteResource={onDeleteResource}
              />
            ))}
            <NewLessonForm disabled={disabled} nextIndex={m.lessons.length + 1} onCreate={onCreateLesson} />
          </div>
        </div>
      )}
    </div>
  );
}

function LessonRow({
  lesson,
  disabled,
  onSave,
  onDelete,
  onCreateResource,
  onDeleteResource,
}: {
  lesson: Lesson;
  disabled: boolean;
  onSave: (data: Record<string, unknown>) => void;
  onDelete: () => void;
  onCreateResource: (data: Record<string, unknown>) => void;
  onDeleteResource: (resourceId: string) => void;
}) {
  const [title, setTitle] = useState(lesson.title);
  const [videoUrl, setVideoUrl] = useState(lesson.videoUrl ?? "");
  const [pdfUrl, setPdfUrl] = useState(lesson.pdfUrl ?? "");
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-beige-line/70 p-3">
      <div className="flex flex-wrap items-end gap-2">
        <span className="text-xs text-choco-soft">{String(lesson.index).padStart(2, "0")}</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-48 rounded-lg border border-beige-line bg-white px-2.5 py-1.5 text-xs" />
        <input placeholder="video URL" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="w-40 rounded-lg border border-beige-line bg-white px-2.5 py-1.5 text-xs" />
        <input placeholder="PDF URL" value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} className="w-40 rounded-lg border border-beige-line bg-white px-2.5 py-1.5 text-xs" />
        <button
          disabled={disabled}
          onClick={() => onSave({ title, videoUrl: videoUrl || null, pdfUrl: pdfUrl || null })}
          className="rounded-full bg-choco px-3 py-1.5 text-xs font-semibold text-cream disabled:opacity-50"
        >
          Сохранить
        </button>
        <button onClick={() => setResourcesOpen((v) => !v)} className="text-xs text-berry-deep hover:underline">
          Материалы ({lesson.resources.length})
        </button>
        <button disabled={disabled} onClick={onDelete} className="text-xs text-choco-soft hover:text-berry-deep">
          Удалить
        </button>
      </div>

      {resourcesOpen && (
        <div className="ml-6 flex flex-col gap-2 border-l border-beige-line pl-4">
          {lesson.resources.map((r) => (
            <div key={r.id} className="flex items-center gap-2 text-xs">
              <span className="text-choco">{r.title}</span>
              <span className="truncate text-choco-soft">{r.url}</span>
              <button
                disabled={disabled}
                onClick={() => onDeleteResource(r.id)}
                className="shrink-0 text-choco-soft hover:text-berry-deep"
              >
                Удалить
              </button>
            </div>
          ))}
          <NewResourceForm disabled={disabled} onCreate={onCreateResource} />
        </div>
      )}
    </div>
  );
}

function NewResourceForm({ disabled, onCreate }: { disabled: boolean; onCreate: (data: Record<string, unknown>) => void }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    onCreate({ title, url });
    setTitle("");
    setUrl("");
  }

  return (
    <form onSubmit={submit} className="flex items-end gap-2">
      <input placeholder="Название материала" value={title} onChange={(e) => setTitle(e.target.value)} className="w-40 rounded-lg border border-beige-line bg-white px-2.5 py-1.5 text-xs" />
      <input placeholder="URL файла" value={url} onChange={(e) => setUrl(e.target.value)} className="w-48 rounded-lg border border-beige-line bg-white px-2.5 py-1.5 text-xs" />
      <button disabled={disabled} type="submit" className="rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-3 py-1.5 text-xs font-bold text-white">
        Добавить
      </button>
    </form>
  );
}

function NewLessonForm({ disabled, nextIndex, onCreate }: { disabled: boolean; nextIndex: number; onCreate: (data: Record<string, unknown>) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    onCreate({ index: nextIndex, title });
    setOpen(false);
    setTitle("");
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="self-start text-xs font-semibold text-berry-deep hover:underline">
        + Добавить урок
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex items-end gap-2">
      <input placeholder="Название урока" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-56 rounded-lg border border-beige-line bg-white px-2.5 py-1.5 text-xs" />
      <button disabled={disabled} type="submit" className="rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-4 py-1.5 text-xs font-bold text-white">
        Создать
      </button>
    </form>
  );
}

function NewModuleForm({ disabled, nextIndex, onCreate }: { disabled: boolean; nextIndex: number; onCreate: (data: Record<string, unknown>) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    onCreate({ index: nextIndex, title });
    setOpen(false);
    setTitle("");
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="self-start rounded-full border border-beige-line px-4 py-2 text-xs font-semibold text-choco-soft hover:bg-white">
        + Добавить модуль
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex items-end gap-3 rounded-2xl border border-dashed border-beige-line p-4">
      <input placeholder="Название модуля" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-56 rounded-xl border border-beige-line bg-white px-3 py-2 text-sm" />
      <button disabled={disabled} type="submit" className="rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-4 py-2 text-xs font-bold text-white">
        Создать
      </button>
    </form>
  );
}

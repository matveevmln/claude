import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getMemberCourseData, getContinueWatching } from "@/lib/lms";
import { getEffectiveUserId } from "@/lib/impersonation";
import { CertificateCard } from "@/components/account/CertificateCard";

export default async function DashboardPage() {
  const session = await auth();
  const { userId } = await getEffectiveUserId(session!);

  const [data, notifications, viewedUser, continueWatching, announcements] = await Promise.all([
    getMemberCourseData(userId),
    db.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
    db.user.findUnique({ where: { id: userId }, select: { name: true } }),
    getContinueWatching(userId),
    db.announcement.findMany({ orderBy: { publishedAt: "desc" }, take: 3 }),
  ]);

  const nextLesson = data.modules
    .filter((m) => m.unlocked)
    .flatMap((m) => m.lessons.map((l) => ({ ...l, moduleTitle: m.title })))
    .find((l) => !l.completed);

  const showContinueWatching = continueWatching && continueWatching.lessonId !== nextLesson?.id;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-berry-deep">Дашборд</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-choco sm:text-3xl">
          С возвращением, {viewedUser?.name?.split(" ")[0] ?? "гостья"}!
        </h1>
        {data.tariffName && <p className="mt-1 text-sm text-choco-soft">Ваш тариф: «{data.tariffName}»</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Прогресс курса" value={`${data.progressPercent}%`} />
        <StatCard label="Уроков пройдено" value={`${data.totalCompleted} из ${data.totalLessons}`} />
        <StatCard label="Модулей открыто" value={`${data.modules.filter((m) => m.unlocked).length}`} />
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-beige">
        <div
          className="h-full rounded-full bg-gradient-to-r from-berry-deep to-berry-strong transition-all"
          style={{ width: `${data.progressPercent}%` }}
        />
      </div>

      {nextLesson && (
        <div className="rounded-3xl border border-blush-deep/50 bg-gradient-to-b from-white to-blush/40 p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-berry-deep">Продолжить обучение</p>
          <h2 className="mt-1 font-display text-xl font-bold text-choco">{nextLesson.title}</h2>
          <p className="mt-1 text-sm text-choco-soft">{nextLesson.moduleTitle}</p>
          <Link
            href={`/account/course/${nextLesson.id}`}
            className="mt-4 inline-flex rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
          >
            Смотреть урок →
          </Link>
        </div>
      )}

      {showContinueWatching && continueWatching && (
        <div className="rounded-3xl border border-beige-line bg-white/60 p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-berry-deep">Вы остановились здесь</p>
          <h2 className="mt-1 font-display text-xl font-bold text-choco">{continueWatching.lessonTitle}</h2>
          <p className="mt-1 text-sm text-choco-soft">
            {continueWatching.moduleTitle} · {Math.floor(continueWatching.positionSec / 60)} мин просмотрено
          </p>
          <Link
            href={`/account/course/${continueWatching.lessonId}`}
            className="mt-4 inline-flex rounded-full border border-beige-line px-6 py-3 text-sm font-bold text-choco transition hover:bg-white"
          >
            Продолжить просмотр →
          </Link>
        </div>
      )}

      {data.progressPercent === 100 && <CertificateCard />}

      {announcements.length > 0 && (
        <div className="rounded-3xl border border-beige-line bg-white/60 p-6">
          <h2 className="font-display text-lg font-bold text-choco">Новости курса</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {announcements.map((a) => (
              <li key={a.id} className="border-b border-beige-line pb-3 text-sm last:border-0 last:pb-0">
                <p className="font-semibold text-choco">{a.title}</p>
                <p className="text-choco-soft">{a.body}</p>
                <p className="mt-1 text-xs text-choco-soft">{a.publishedAt.toLocaleDateString("ru-RU")}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {notifications.length > 0 && (
        <div className="rounded-3xl border border-beige-line bg-white/60 p-6">
          <h2 className="font-display text-lg font-bold text-choco">Уведомления</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {notifications.map((n) => (
              <li key={n.id} className="border-b border-beige-line pb-3 text-sm last:border-0 last:pb-0">
                <p className="font-semibold text-choco">{n.title}</p>
                <p className="text-choco-soft">{n.body}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-beige-line bg-white/60 p-5">
      <p className="font-display text-2xl font-extrabold text-berry-deep">{value}</p>
      <p className="mt-1 text-xs text-choco-soft">{label}</p>
    </div>
  );
}

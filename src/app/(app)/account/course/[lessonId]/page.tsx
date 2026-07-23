import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLesson } from "@/lib/lms";
import { getEffectiveUserId } from "@/lib/impersonation";
import { VideoPlayer } from "@/components/account/VideoPlayer";
import { LessonCompleteToggle } from "@/components/account/LessonCompleteToggle";
import { LessonKeyboardShortcuts } from "@/components/account/LessonKeyboardShortcuts";
import { CommentSection } from "@/components/account/CommentSection";

export default async function LessonPage({ params }: PageProps<"/account/course/[lessonId]">) {
  const { lessonId } = await params;
  const session = await auth();
  const { userId } = await getEffectiveUserId(session!);
  const data = await getLesson(lessonId, userId);

  if (!data) notFound();

  const { lesson, completed, positionSec, prevLessonId, nextLessonId } = data;

  const authorIds = Array.from(new Set(lesson.comments.map((c) => c.userId)));
  const authorUsers = authorIds.length
    ? await db.user.findMany({ where: { id: { in: authorIds } }, select: { id: true, name: true } })
    : [];
  const authors = Object.fromEntries(authorUsers.map((u) => [u.id, u]));

  const prevHref = prevLessonId ? `/account/course/${prevLessonId}` : null;
  const nextHref = nextLessonId ? `/account/course/${nextLessonId}` : null;

  return (
    <div className="flex flex-col gap-6">
      <LessonKeyboardShortcuts lessonId={lesson.id} completed={completed} prevHref={prevHref} nextHref={nextHref} />

      <Link href="/account/course" className="text-sm text-choco-soft hover:text-berry-deep">
        ← Ко всем модулям
      </Link>

      <VideoPlayer videoUrl={lesson.videoUrl} title={lesson.title} lessonId={lesson.id} initialPositionSec={positionSec} />

      <div>
        <h1 className="font-display text-2xl font-bold text-choco sm:text-3xl">{lesson.title}</h1>
        {lesson.summary && <p className="mt-2 text-sm text-choco-soft">{lesson.summary}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <LessonCompleteToggle lessonId={lesson.id} initialCompleted={completed} />
        {lesson.pdfUrl && (
          <a
            href={lesson.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-beige-line px-5 py-3 text-sm font-semibold text-choco transition hover:bg-white"
          >
            📄 Открыть PDF урока
          </a>
        )}
      </div>
      <p className="text-xs text-choco-soft/70">
        Клавиши: ← / → — соседний урок, C — отметить как пройденный
      </p>

      {lesson.resources.length > 0 && (
        <div className="rounded-3xl border border-beige-line bg-white/60 p-6">
          <h2 className="font-display text-lg font-bold text-choco">Материалы к уроку</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {lesson.resources.map((r) => (
              <li key={r.id}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-berry-deep hover:underline"
                >
                  📎 {r.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-beige-line pt-5">
        {prevHref ? (
          <Link href={prevHref} className="text-sm font-medium text-choco-soft hover:text-berry-deep">
            ← Предыдущий урок
          </Link>
        ) : (
          <span />
        )}
        {nextHref && (
          <Link href={nextHref} className="text-sm font-medium text-berry-deep">
            Следующий урок →
          </Link>
        )}
      </div>

      <div className="border-t border-beige-line pt-6">
        <CommentSection
          lessonId={lesson.id}
          comments={lesson.comments.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() }))}
          authors={authors}
          currentUserId={userId}
        />
      </div>
    </div>
  );
}

import { db } from "@/lib/db";
import { site } from "@/config/site";

export async function getMemberCourseData(userId: string, productSlug = site.primaryProductSlug) {
  const enrollments = await db.enrollment.findMany({
    where: { userId, tariff: { product: { slug: productSlug } } },
    include: { tariff: true },
  });

  const enrolledTariffIds = new Set(enrollments.map((e) => e.tariffId));
  const highestTariff = enrollments.sort((a, b) => b.tariff.price - a.tariff.price)[0]?.tariff ?? null;

  const modules = await db.module.findMany({
    where: { product: { slug: productSlug } },
    orderBy: { index: "asc" },
    include: {
      lessons: { orderBy: { index: "asc" } },
      tariffAccess: true,
    },
  });

  const progressRows = await db.lessonProgress.findMany({ where: { userId } });
  const progressByLesson = new Map(progressRows.map((p) => [p.lessonId, p]));

  const modulesWithAccess = modules.map((m) => {
    const unlocked = m.tariffAccess.some((a) => enrolledTariffIds.has(a.tariffId));
    const lessons = m.lessons.map((l) => ({
      ...l,
      completed: progressByLesson.get(l.id)?.completed ?? false,
    }));
    const completedCount = lessons.filter((l) => l.completed).length;
    return {
      id: m.id,
      index: m.index,
      title: m.title,
      subtitle: m.subtitle,
      unlocked,
      lessons,
      completedCount,
      totalCount: lessons.length,
    };
  });

  const totalLessons = modulesWithAccess.filter((m) => m.unlocked).reduce((sum, m) => sum + m.totalCount, 0);
  const totalCompleted = modulesWithAccess.filter((m) => m.unlocked).reduce((sum, m) => sum + m.completedCount, 0);

  return {
    tariffName: highestTariff?.name ?? null,
    enrolledTariffIds,
    modules: modulesWithAccess,
    progressPercent: totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0,
    totalLessons,
    totalCompleted,
  };
}

export async function getLesson(lessonId: string, userId: string) {
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: { include: { tariffAccess: true } },
      resources: true,
      comments: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!lesson) return null;

  const enrollments = await db.enrollment.findMany({ where: { userId } });
  const enrolledTariffIds = new Set(enrollments.map((e) => e.tariffId));
  const unlocked = lesson.module.tariffAccess.some((a) => enrolledTariffIds.has(a.tariffId));
  if (!unlocked) return null;

  const progress = await db.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });

  const siblingLessons = await db.lesson.findMany({
    where: { moduleId: lesson.moduleId },
    orderBy: { index: "asc" },
  });
  const currentIdx = siblingLessons.findIndex((l) => l.id === lessonId);

  return {
    lesson,
    completed: progress?.completed ?? false,
    positionSec: progress?.positionSec ?? 0,
    prevLessonId: currentIdx > 0 ? siblingLessons[currentIdx - 1].id : null,
    nextLessonId: currentIdx < siblingLessons.length - 1 ? siblingLessons[currentIdx + 1].id : null,
  };
}

export async function toggleLessonProgress(userId: string, lessonId: string, completed: boolean) {
  await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { completed, completedAt: completed ? new Date() : null, lastViewedAt: new Date() },
    create: { userId, lessonId, completed, completedAt: completed ? new Date() : null, lastViewedAt: new Date() },
  });
}

export async function saveLessonPosition(userId: string, lessonId: string, positionSec: number) {
  await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { positionSec, lastViewedAt: new Date() },
    create: { userId, lessonId, positionSec, lastViewedAt: new Date() },
  });
}

/** Most recently watched, not-yet-completed lesson — powers the dashboard's "Continue watching" card. */
export async function getContinueWatching(userId: string) {
  const progress = await db.lessonProgress.findFirst({
    where: { userId, completed: false, lastViewedAt: { not: null } },
    orderBy: { lastViewedAt: "desc" },
    include: { lesson: { include: { module: true } } },
  });
  if (!progress) return null;
  return {
    lessonId: progress.lessonId,
    lessonTitle: progress.lesson.title,
    moduleTitle: progress.lesson.module.title,
    positionSec: progress.positionSec,
  };
}

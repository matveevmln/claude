import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { AnnouncementManager } from "@/components/admin/AnnouncementManager";

export default async function AdminAnnouncementsPage() {
  await requireAdmin();
  const announcements = await db.announcement.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-choco sm:text-3xl">Объявления</h1>
      <AnnouncementManager announcements={announcements.map((a) => ({ ...a, publishedAt: a.publishedAt.toISOString() }))} />
    </div>
  );
}

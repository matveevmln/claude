import { auth } from "@/lib/auth";
import { getMemberCourseData } from "@/lib/lms";
import { getEffectiveUserId } from "@/lib/impersonation";
import { CourseExplorer } from "@/components/account/CourseExplorer";

export default async function CoursePage() {
  const session = await auth();
  const { userId } = await getEffectiveUserId(session!);
  const data = await getMemberCourseData(userId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-berry-deep">Курс</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-choco sm:text-3xl">
          Большая Домашняя Кондитерская
        </h1>
      </div>
      <CourseExplorer modules={data.modules} />
    </div>
  );
}

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getEffectiveUserId } from "@/lib/impersonation";
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";

export default async function ProfilePage() {
  const session = await auth();
  const { userId, isImpersonating } = await getEffectiveUserId(session!);
  const user = await db.user.findUniqueOrThrow({ where: { id: userId } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-berry-deep">Профиль</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-choco sm:text-3xl">Ваши данные</h1>
      </div>

      <div className="rounded-3xl border border-beige-line bg-white/60 p-6">
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between border-b border-beige-line pb-3">
            <dt className="text-choco-soft">Имя</dt>
            <dd className="font-medium text-choco">{user.name ?? "—"}</dd>
          </div>
          <div className="flex justify-between border-b border-beige-line pb-3">
            <dt className="text-choco-soft">Email</dt>
            <dd className="font-medium text-choco">{user.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-choco-soft">В курсе с</dt>
            <dd className="font-medium text-choco">{user.createdAt.toLocaleDateString("ru-RU")}</dd>
          </div>
        </dl>
      </div>

      {isImpersonating ? (
        <div className="rounded-3xl border border-beige-line bg-white/60 p-6">
          <h2 className="font-display text-lg font-bold text-choco">Сменить пароль</h2>
          <p className="mt-2 text-sm text-choco-soft">
            Недоступно в режиме просмотра от имени клиента. Используйте «Сбросить пароль вручную» в админке.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-beige-line bg-white/60 p-6">
          <h2 className="font-display text-lg font-bold text-choco">Сменить пароль</h2>
          <ChangePasswordForm />
        </div>
      )}
    </div>
  );
}

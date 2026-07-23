import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { site } from "@/config/site";

export default async function CertificatePage({ params }: PageProps<"/certificate/[serial]">) {
  const { serial } = await params;
  const certificate = await db.certificate.findUnique({
    where: { serial },
    include: { user: true, tariff: true },
  });

  if (!certificate) notFound();

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5 py-16">
      <div className="w-full max-w-xl rounded-[2.5rem] border-4 border-double border-gold-light bg-white p-10 text-center shadow-xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-berry-deep">Сертификат о прохождении</p>
        <h1 className="mt-4 font-display text-3xl font-bold text-choco">{site.productName}</h1>
        <p className="mt-6 text-sm text-choco-soft">Настоящим подтверждается, что</p>
        <p className="mt-2 font-display text-2xl font-extrabold text-berry-deep">
          {certificate.user.name ?? certificate.user.email}
        </p>
        <p className="mt-2 text-sm text-choco-soft">успешно завершил(а) курс на тарифе «{certificate.tariff.name}»</p>
        <p className="mt-6 text-xs text-choco-soft">
          Дата выдачи: {certificate.issuedAt.toLocaleDateString("ru-RU")}
        </p>
        <p className="mt-1 text-xs text-choco-soft/70">Серийный номер: {certificate.serial}</p>
        <div className="mt-8 border-t border-beige-line pt-4">
          <p className="text-xs text-choco-soft">{site.brand} · {site.domain}</p>
        </div>
      </div>
    </div>
  );
}

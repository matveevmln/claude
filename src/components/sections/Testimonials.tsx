import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { testimonials } from "@/lib/content/product";

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-white/40 py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Истории учениц"
          title="Женщины, которые уже пекут иначе"
          subtitle="Реальные результаты — от «первого ровного бисквита» до первых платных заказов."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.05}>
              <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-beige-line bg-cream shadow-[0_16px_36px_-28px_rgba(43,27,36,0.35)]">
                <PhotoSlot
                  slotId={t.imageSlot}
                  ratio="aspect-[4/3]"
                  label={`Фото: ${t.name}, ${t.age} лет, с готовым тортом`}
                  className="rounded-none rounded-t-3xl border-0 border-b border-beige-line"
                />
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <p className="text-sm leading-relaxed text-choco-soft">«{t.quote}»</p>
                  <p className="mt-auto rounded-xl bg-blush/60 px-3 py-2 text-xs font-semibold text-berry-deep">
                    {t.result}
                  </p>
                  <p className="text-xs text-choco-soft/70">
                    {t.name}, {t.age} лет · {t.city}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

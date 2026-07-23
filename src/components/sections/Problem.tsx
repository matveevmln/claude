import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Problem() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Знакомо?"
          title="Вы печёте руками и сердцем. Не хватает только системы"
          subtitle="90% домашних кондитеров застревают на этапе интуитивного «на глаз» — вместо точных граммовок и понятной последовательности."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Reveal>
            <div className="rounded-3xl border border-beige-line bg-white/60 p-6">
              <p className="font-display text-lg font-bold text-choco">Знакомо?</p>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-choco-soft">
                <li>— Бисквит то оседает, то крошится — и непонятно, почему</li>
                <li>— Крем то течёт, то расслаивается на жаре</li>
                <li>— Торт красивый в голове, но не такой в разрезе</li>
                <li>— Страшно брать первый платный заказ</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-blush-deep/50 bg-gradient-to-b from-white to-blush/40 p-6">
              <p className="font-display text-lg font-bold text-choco">С «Дом Десертов»</p>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-choco-soft">
                <li>— Точные граммовки и температуры на каждом шаге</li>
                <li>— Чек-листы, которые не дают забыть важное</li>
                <li>— Пошаговое видео крупным планом — как рядом с наставником</li>
                <li>— Отдельный модуль о первых платных заказах</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

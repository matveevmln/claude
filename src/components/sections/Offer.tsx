import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const pains = [
  "Бисквит то оседает, то получается сухим — и никогда не знаешь заранее",
  "Крем «плывёт», торт кособочит, а ровный срез — как в кондитерской — не выходит",
  "Рецепты из интернета противоречат друг другу, а результат непредсказуем",
  "Хочется печь на заказ, но страшно: «а вдруг не получится, а деньги уже взяли»",
];

const promises = [
  "Точные граммовки и температура — результат предсказуем с первого раза",
  "Пошаговая сборка и выравнивание «под зеркало», без просадки и перекоса",
  "Единая проверенная система вместо десятков противоречивых видео",
  "Отдельный модуль о том, как красиво упаковать и продать первый торт",
];

export function Offer() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Знакомая ситуация?"
          title="Вы печёте руками и сердцем. Не хватает только системы"
          subtitle="90% домашних кондитеров застревают не из-за отсутствия таланта, а из-за отсутствия точных граммовок, техники сборки и обратной связи."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-beige-line bg-white/50 p-7">
              <h3 className="font-display text-xl font-bold text-choco">Знакомо?</h3>
              <ul className="mt-5 flex flex-col gap-4">
                {pains.map((p) => (
                  <li key={p} className="flex gap-3 text-sm text-choco-soft sm:text-base">
                    <span className="mt-0.5 text-choco-soft">✕</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full rounded-3xl border border-blush-deep/50 bg-gradient-to-b from-white to-blush/50 p-7">
              <h3 className="font-display text-xl font-bold text-choco">С «Дом Десертов»</h3>
              <ul className="mt-5 flex flex-col gap-4">
                {promises.map((p) => (
                  <li key={p} className="flex gap-3 text-sm text-choco-soft sm:text-base">
                    <span className="mt-0.5 text-berry-deep">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

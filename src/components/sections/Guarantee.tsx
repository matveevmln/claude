import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function Guarantee() {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <Reveal>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-3xl border border-gold-light/60 bg-gradient-to-b from-white to-cream-deep/70 p-8 text-center sm:p-10">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-light/30 text-2xl">
              🛡️
            </span>
            <h3 className="font-display text-2xl font-bold text-choco sm:text-3xl">Гарантия 14 дней</h3>
            <p className="max-w-xl text-sm text-choco-soft sm:text-base">
              Пройдите первые уроки. Если поймёте, что курс не подходит — напишите в поддержку в
              течение 14 дней, и мы вернём деньги полностью, без лишних вопросов.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

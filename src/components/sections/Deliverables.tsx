import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const items = [
  { icon: "🎬", title: "Видеоуроки", description: "40+ уроков от 10 до 25 минут — снято крупным планом" },
  { icon: "📖", title: "PDF книга рецептов", description: "120 проверенных рецептов с точными граммовками" },
  { icon: "📋", title: "Технологические карты", description: "Температура, время и заметки по каждому этапу" },
];

export function Deliverables() {
  return (
    <section className="bg-white/40 py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Что внутри"
          title="Не просто видео — полный рабочий комплект"
          subtitle="Всё, что нужно, чтобы повторить результат на своей кухне без лишних вопросов."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div className="flex h-full flex-col gap-3 rounded-3xl border border-beige-line bg-white/70 p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blush text-2xl">
                  {item.icon}
                </span>
                <p className="font-display text-lg font-bold text-choco">{item.title}</p>
                <p className="text-sm text-choco-soft">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

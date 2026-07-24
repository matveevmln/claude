import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const items = [
  {
    title: "Видеоуроки",
    text: "40+ уроков по 15–25 минут, крупный план рук, понятная озвучка без «воды».",
    icon: "🎬",
  },
  {
    title: "PDF-книга рецептов",
    text: "120 проверенных рецептов с точными граммовками — держите под рукой на кухне.",
    icon: "📖",
  },
  {
    title: "Технологические карты",
    text: "Температура, время, граммовки по каждому этапу — как в профессиональной кондитерской.",
    icon: "📋",
  },
  {
    title: "Чек-листы к урокам",
    text: "Что подготовить заранее, чтобы ничего не забыть в процессе готовки.",
    icon: "✅",
  },
  {
    title: "Списки ингредиентов",
    text: "Что купить и чем заменить, если чего-то нет в вашем городе.",
    icon: "🛒",
  },
  {
    title: "Закрытый чат учениц",
    text: "Делитесь результатами, получайте поддержку и обратную связь.",
    icon: "💬",
  },
];

export function WhatsIncluded() {
  return (
    <section className="bg-white/40 py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Что внутри" title="Не просто видео — полный рабочий комплект" />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.04}>
              <div className="h-full rounded-3xl border border-beige-line bg-noise-card p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                  {item.icon}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-choco">{item.title}</h3>
                <p className="mt-2 text-sm text-choco-soft">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

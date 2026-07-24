import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { benefits } from "@/lib/content/product";
import { SeededGlyph } from "@/components/ui/Ornaments";

export function Benefits() {
  return (
    <section className="bg-white/40 py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Почему именно так"
          title="Курс, который проектировали вокруг вашей занятой жизни"
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.05}>
              <div className="h-full rounded-3xl border border-beige-line bg-cream p-6 transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(232,87,123,0.35)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blush">
                  <SeededGlyph seed={b.title} className="h-6 w-6 text-berry" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-choco">{b.title}</h3>
                <p className="mt-2 text-sm text-choco-soft">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

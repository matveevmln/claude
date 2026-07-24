import { Container } from "@/components/ui/Container";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";

export function Author() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <PhotoSlot
            slotId="author-portrait"
            ratio="aspect-[4/5]"
            label="Портрет: женщина 40+, тёплая улыбка, фартук, домашняя кухня — лицо бренда"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-berry-deep">
            Кто ведёт курс
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-choco sm:text-4xl">{site.author.name}</h2>
          <p className="mt-1 text-sm text-choco-soft">{site.author.role}</p>
          <p className="mt-5 text-base leading-relaxed text-choco-soft sm:text-lg">
            {site.author.bio}
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            {["12 лет практики", "500+ учениц", "Своя кондитерская на дому"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-blush-deep/50 bg-blush/50 px-4 py-2 text-xs font-semibold text-choco"
              >
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

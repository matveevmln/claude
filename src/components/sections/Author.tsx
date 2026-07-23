import { Container } from "@/components/ui/Container";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";

export function Author() {
  return (
    <section className="bg-white/40 py-16 sm:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <PhotoSlot slotId="author-portrait" ratio="aspect-[4/5]" label={`Портрет ${site.author.name}`} />
        </Reveal>
        <Reveal delay={0.1}>
          <span className="inline-flex rounded-full border border-beige-line bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-berry-deep">
            Курс, который проектировали вокруг вашей занятой жизни
          </span>
          <h2 className="mt-4 font-display text-2xl font-extrabold text-choco sm:text-3xl">{site.author.name}</h2>
          <p className="mt-1 text-sm font-medium text-berry-deep">{site.author.role}</p>
          <p className="mt-4 text-sm leading-relaxed text-choco-soft sm:text-base">{site.author.bio}</p>
        </Reveal>
      </Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <span className="inline-flex rounded-full border border-beige-line bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-berry-deep">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 font-display text-2xl font-extrabold text-choco sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-3 text-sm text-choco-soft sm:text-base">{subtitle}</p>}
    </div>
  );
}

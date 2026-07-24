import { ReactNode } from "react";
import clsx from "clsx";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-blush-deep/60 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-berry-deep">
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="font-display max-w-3xl text-3xl font-bold leading-[1.1] text-choco sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {subtitle && <p className="max-w-2xl text-base text-choco-soft sm:text-lg">{subtitle}</p>}
    </div>
  );
}

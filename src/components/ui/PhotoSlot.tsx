import clsx from "clsx";
import { SeededGlyph } from "./Ornaments";

/**
 * Placeholder for real photography. `slotId` matches an entry in
 * content/creative-prompts.md — replace this component's contents with a
 * <Image> once you have the generated/shot photo for that slot.
 */
export function PhotoSlot({
  slotId,
  label,
  className,
  ratio = "aspect-[4/5]",
}: {
  slotId: string;
  label?: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      data-photo-slot={slotId}
      role="img"
      aria-label={label ?? "Фотография десерта"}
      className={clsx(
        "relative overflow-hidden rounded-[2rem] border border-beige-line/70 bg-noise-card",
        ratio,
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_18%,rgba(255,255,255,0.75),transparent_55%)]" />
      <div aria-hidden className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-berry/45">
        <SeededGlyph seed={slotId} className="h-12 w-12" />
        {label && (
          <span className="max-w-[70%] text-center text-xs font-medium tracking-wide text-choco-soft">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Placeholder for a real photo/asset. Renders a soft gradient block with
 * an accessible label so the layout looks finished before real photography
 * is dropped in — see docs/creative-prompts.md for the AI photo brief.
 */
export function PhotoSlot({
  slotId,
  ratio = "aspect-[4/3]",
  label,
  className = "",
}: {
  slotId: string;
  ratio?: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      data-photo-slot={slotId}
      role="img"
      aria-label={label}
      className={`relative overflow-hidden rounded-[2rem] border border-beige-line/70 bg-noise-card ${ratio} ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_18%,rgba(255,255,255,0.75),transparent_55%)]" />
    </div>
  );
}

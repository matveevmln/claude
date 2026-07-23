export function CakeGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 20h16v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 15h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 12v-2M12 12v-2M15 12v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

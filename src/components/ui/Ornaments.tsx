// Minimal gold line-art accents — hand-drawn style, used across photo
// placeholders and section dividers so the page reads as designed rather
// than empty while real photography is not yet in place.

export function CakeGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path
        d="M12 30c0-3 2-5 5-5h30c3 0 5 2 5 5v4H12v-4Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M14 34h36l-2 20a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4l-2-20Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M14 42c3 2 6 2 9 0s6-2 9 0 6 2 9 0 6-2 9 0" stroke="currentColor" strokeWidth="1.2" />
      <path d="M32 25v-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M32 12c-3 0-3-4 0-4s3 4 0 4Z" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function WhiskGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M32 8v20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M24 12c0 10 4 16 8 16s8-6 8-16" stroke="currentColor" strokeWidth="1.2" />
      <path d="M20 10c0 12 5 18 12 18s12-6 12-18" stroke="currentColor" strokeWidth="1.2" />
      <path d="M32 40v16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <rect x="28" y="52" width="8" height="6" rx="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function BerryGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <circle cx="24" cy="38" r="10" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="40" cy="30" r="8" stroke="currentColor" strokeWidth="1.3" />
      <path d="M24 28c0-6 4-10 10-12M40 22c0-4 2-7 6-9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function MacaronGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M12 24c0-6 9-10 20-10s20 4 20 10-9 8-20 8-20-2-20-8Z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M14 24v6c0 5 8 8 18 8s18-3 18-8v-6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M12 38c0-6 9-10 20-10s20 4 20 10-9 8-20 8-20-2-20-8Z" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function SparkleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path
        d="M32 6c1.5 10 4 17.5 11 22 7 4.5 14 6 14 6s-7 1.5-14 6c-7 4.5-9.5 12-11 22-1.5-10-4-17.5-11-22-7-4.5-14-6-14-6s7-1.5 14-6c7-4.5 9.5-12 11-22Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const GLYPHS = [CakeGlyph, WhiskGlyph, BerryGlyph, MacaronGlyph, SparkleGlyph];

function indexForSeed(seed: string) {
  return seed.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % GLYPHS.length;
}

/** Deterministically picks one of the line-art glyphs based on a seed string. */
export function SeededGlyph({ seed, className }: { seed: string; className?: string }) {
  const Glyph = GLYPHS[indexForSeed(seed)];
  return <Glyph className={className} />;
}

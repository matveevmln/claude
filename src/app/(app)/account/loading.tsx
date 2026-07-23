export default function AccountLoading() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-live="polite">
      <div className="h-6 w-40 animate-pulse rounded-full bg-beige" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl border border-beige-line bg-white/60" />
        ))}
      </div>
      <div className="h-40 animate-pulse rounded-3xl border border-beige-line bg-white/60" />
      <div className="h-40 animate-pulse rounded-3xl border border-beige-line bg-white/60" />
    </div>
  );
}

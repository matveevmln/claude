export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-live="polite">
      <div className="h-8 w-48 animate-pulse rounded-full bg-beige" />
      <div className="h-96 animate-pulse rounded-3xl border border-beige-line bg-white/60" />
    </div>
  );
}

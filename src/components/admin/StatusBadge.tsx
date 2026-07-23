const styles: Record<string, string> = {
  PAID: "bg-blush text-berry-deep",
  PENDING: "bg-beige text-choco-soft",
  FAILED: "bg-choco/10 text-choco",
  REFUNDED: "bg-gold-light/40 text-gold-deep",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] ?? ""}`}>{status}</span>;
}

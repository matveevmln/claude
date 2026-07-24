import { Container } from "@/components/ui/Container";

const stats = [
  { value: "500+", label: "учениц прошли курс" },
  { value: "40+", label: "видеоуроков" },
  { value: "120", label: "проверенных рецептов" },
  { value: "4.9★", label: "средняя оценка курса" },
];

export function SocialProofBar() {
  return (
    <div className="border-y border-beige-line/60 bg-white/50 py-6">
      <Container className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center text-center">
            <span className="font-display text-2xl font-extrabold text-berry sm:text-3xl">{s.value}</span>
            <span className="mt-1 text-xs text-choco-soft sm:text-sm">{s.label}</span>
          </div>
        ))}
      </Container>
    </div>
  );
}

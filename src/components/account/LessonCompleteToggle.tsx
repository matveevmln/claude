"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LessonCompleteToggle({
  lessonId,
  initialCompleted,
}: {
  lessonId: string;
  initialCompleted: boolean;
}) {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const next = !completed;
    const res = await fetch(`/api/account/lessons/${lessonId}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: next }),
    });
    if (res.ok) {
      setCompleted(next);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition disabled:opacity-60 ${
        completed
          ? "bg-blush text-berry-deep"
          : "bg-gradient-to-r from-berry-deep to-berry-strong text-white hover:-translate-y-0.5"
      }`}
    >
      {completed ? "✅ Урок пройден" : "Отметить как пройденный"}
    </button>
  );
}

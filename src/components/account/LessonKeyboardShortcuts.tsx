"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Invisible behavior component: ←/→ navigate modules, "c" toggles completion. */
export function LessonKeyboardShortcuts({
  lessonId,
  completed,
  prevHref,
  nextHref,
}: {
  lessonId: string;
  completed: boolean;
  prevHref: string | null;
  nextHref: string | null;
}) {
  const router = useRouter();

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      if (e.key === "ArrowLeft" && prevHref) router.push(prevHref);
      else if (e.key === "ArrowRight" && nextHref) router.push(nextHref);
      else if (e.key === "c" || e.key === "C") {
        fetch(`/api/account/lessons/${lessonId}/progress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: !completed }),
        }).then(() => router.refresh());
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [lessonId, completed, prevHref, nextHref, router]);

  return null;
}

"use client";

import { useEffect, useState } from "react";

/** Simple session-scoped urgency timer for the pricing section — resets on new browser session. */
export function Countdown({ minutes = 1440 }: { minutes?: number }) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    const key = "dd_countdown_deadline";
    let deadline = Number(sessionStorage.getItem(key));
    if (!deadline) {
      deadline = Date.now() + minutes * 60 * 1000;
      sessionStorage.setItem(key, String(deadline));
    }

    function tick() {
      setSecondsLeft(Math.max(0, Math.floor((deadline - Date.now()) / 1000)));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [minutes]);

  if (secondsLeft === null) return null;

  const h = String(Math.floor(secondsLeft / 3600)).padStart(2, "0");
  const m = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, "0");
  const s = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-beige-line bg-white px-4 py-2 text-xs text-choco-soft">
      <span>Цена запуска закончится через:</span>
      <span className="flex gap-1 font-display font-bold text-choco">
        <span className="rounded-md bg-choco px-2 py-0.5 text-cream">{h}</span>:
        <span className="rounded-md bg-choco px-2 py-0.5 text-cream">{m}</span>:
        <span className="rounded-md bg-choco px-2 py-0.5 text-cream">{s}</span>
      </span>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "dd_offer_deadline";
const WINDOW_MS = 24 * 60 * 60 * 1000;

function getDeadline(): number {
  if (typeof window === "undefined") return Date.now() + WINDOW_MS;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const value = Number(stored);
    if (!Number.isNaN(value) && value > Date.now()) return value;
  }
  const deadline = Date.now() + WINDOW_MS;
  window.localStorage.setItem(STORAGE_KEY, String(deadline));
  return deadline;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function Countdown({ className }: { className?: string }) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const deadline = getDeadline();
    const tick = () => setRemaining(Math.max(0, deadline - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (remaining === null) {
    return <div className={className} aria-hidden />;
  }

  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);

  return (
    <div className={className} role="timer" aria-label="Специальная цена действует ограниченное время">
      <div className="flex items-center gap-1.5 font-display text-lg tabular-nums">
        <TimeUnit value={pad(hours)} />
        <span className="text-gold-deep">:</span>
        <TimeUnit value={pad(minutes)} />
        <span className="text-gold-deep">:</span>
        <TimeUnit value={pad(seconds)} />
      </div>
    </div>
  );
}

function TimeUnit({ value }: { value: string }) {
  return <span className="rounded-md bg-choco px-2 py-1 text-cream">{value}</span>;
}

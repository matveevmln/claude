"use client";

import { useState } from "react";

export function CopyReferralLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-2 rounded-3xl border border-blush-deep/50 bg-gradient-to-b from-white to-blush/40 p-6 sm:flex-row sm:items-center sm:justify-between">
      <code className="break-all text-sm font-medium text-choco">{url}</code>
      <button
        onClick={copy}
        className="shrink-0 rounded-full bg-gradient-to-r from-berry-deep to-berry-strong px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
      >
        {copied ? "Скопировано!" : "Скопировать ссылку"}
      </button>
    </div>
  );
}

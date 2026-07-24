"use client";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    ym?: (...args: unknown[]) => void;
    ttq?: { track: (event: string, data?: Record<string, unknown>) => void };
  }
}

type TrackEvent = "ViewContent" | "InitiateCheckout" | "Lead" | "Purchase";

/** Fires the same event across every configured pixel. No-ops for any pixel without an ID. */
export function track(event: TrackEvent, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  window.fbq?.("track", event, data);
  window.ttq?.track(event, data);

  const gaEventMap: Record<TrackEvent, string> = {
    ViewContent: "view_item",
    InitiateCheckout: "begin_checkout",
    Lead: "generate_lead",
    Purchase: "purchase",
  };
  window.gtag?.("event", gaEventMap[event], data);

  const ymGoalMap: Record<TrackEvent, string> = {
    ViewContent: "view_content",
    InitiateCheckout: "initiate_checkout",
    Lead: "lead",
    Purchase: "purchase",
  };
  window.ym?.(Number(process.env.NEXT_PUBLIC_YM_ID) || 0, "reachGoal", ymGoalMap[event], data);
}

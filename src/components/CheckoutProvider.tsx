"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import type { Tariff } from "@/lib/content/product";
import { PaymentModal } from "./ui/PaymentModal";

const CheckoutContext = createContext<(tariffId: Tariff["id"]) => void>(() => {});

export function useCheckout() {
  return useContext(CheckoutContext);
}

const REF_STORAGE_KEY = "dd_ref_code";

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [tariffId, setTariffId] = useState<Tariff["id"] | null>(null);

  // First-touch affiliate attribution: persist ?ref=CODE beyond the landing
  // page visit, so the code still applies if checkout happens later in the
  // session (e.g. after browsing, not immediately on arrival).
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) {
      localStorage.setItem(REF_STORAGE_KEY, JSON.stringify({ code: ref, savedAt: Date.now() }));
    }
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <CheckoutContext.Provider value={setTariffId}>
        {children}
        <PaymentModal tariffId={tariffId} onClose={() => setTariffId(null)} />
      </CheckoutContext.Provider>
    </MotionConfig>
  );
}

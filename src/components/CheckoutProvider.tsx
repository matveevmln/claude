"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { PaymentModal } from "@/components/ui/PaymentModal";

type CheckoutContextValue = {
  openCheckout: (tariffId: string) => void;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
}

const REF_STORAGE_KEY = "dd_ref_code";

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [tariffId, setTariffId] = useState<string | null>(null);

  // First-touch affiliate attribution: persist ?ref=CODE beyond the landing
  // page visit, so the code still applies if checkout happens later in the
  // session (e.g. after browsing, not immediately on arrival).
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) {
      localStorage.setItem(REF_STORAGE_KEY, JSON.stringify({ code: ref, savedAt: Date.now() }));
    }
  }, []);

  const openCheckout = useCallback((id: string) => setTariffId(id), []);
  const close = useCallback(() => setTariffId(null), []);

  return (
    <CheckoutContext.Provider value={{ openCheckout }}>
      {children}
      {tariffId && <PaymentModal tariffId={tariffId} onClose={close} />}
    </CheckoutContext.Provider>
  );
}

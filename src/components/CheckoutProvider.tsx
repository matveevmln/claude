"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";
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

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [tariffId, setTariffId] = useState<string | null>(null);

  const openCheckout = useCallback((id: string) => setTariffId(id), []);
  const close = useCallback(() => setTariffId(null), []);

  return (
    <CheckoutContext.Provider value={{ openCheckout }}>
      {children}
      {tariffId && <PaymentModal tariffId={tariffId} onClose={close} />}
    </CheckoutContext.Provider>
  );
}

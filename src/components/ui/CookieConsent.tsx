"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "dd_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // One-time read of an external store (localStorage) on mount — not derivable from props/state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  function accept() {
    window.localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="region"
          aria-label="Уведомление об использовании файлов cookie"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="fixed inset-x-4 bottom-20 z-50 mx-auto flex max-w-xl flex-col gap-3 rounded-2xl border border-beige-line bg-white/95 p-4 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between lg:bottom-4"
        >
          <p className="text-xs text-choco-soft">
            Мы используем файлы cookie для аналитики и персонализации рекламы. Продолжая
            пользоваться сайтом, вы соглашаетесь с{" "}
            <a href="/privacy" className="underline hover:text-berry-deep">
              политикой конфиденциальности
            </a>
            .
          </p>
          <button
            onClick={accept}
            className="shrink-0 rounded-full bg-choco px-5 py-2 text-xs font-semibold text-cream transition hover:bg-choco-soft"
          >
            Понятно
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

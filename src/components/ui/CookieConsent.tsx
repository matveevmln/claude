"use client";

import { useEffect, useState } from "react";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("dd_cookie_consent")) {
      // One-time read of an external store (localStorage) on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("dd_cookie_consent", "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="alert"
      className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center justify-between gap-3 border-t border-beige-line bg-white/95 p-4 backdrop-blur-md sm:flex-row"
    >
      <p className="text-xs text-choco-soft sm:text-sm">
        Мы используем cookies для аналитики и персонализации. Продолжая пользоваться сайтом, вы соглашаетесь с{" "}
        <a href="/privacy" className="underline hover:text-berry-deep">
          политикой конфиденциальности
        </a>
        .
      </p>
      <button
        onClick={accept}
        className="shrink-0 rounded-full bg-choco px-5 py-2.5 text-xs font-semibold text-cream transition hover:bg-choco/90"
      >
        Понятно
      </button>
    </div>
  );
}

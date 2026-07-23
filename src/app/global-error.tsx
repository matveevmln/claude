"use client";

import { useEffect } from "react";

/**
 * Catches errors thrown by the root layout itself (font loading, JSON-LD
 * generation, etc) — the one place a normal error.tsx can't reach, since
 * it renders *inside* the root layout. Must render its own <html>/<body>.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="ru">
      <body>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "0 1.25rem",
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
            background: "#FFF8F6",
          }}
        >
          <p style={{ fontSize: "2.5rem" }}>😕</p>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#2B1B24" }}>Что-то пошло не так</h1>
          <p style={{ maxWidth: "24rem", fontSize: "0.875rem", color: "#6B5A62" }}>
            Мы уже знаем об ошибке. Попробуйте обновить страницу.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "0.5rem",
              borderRadius: "9999px",
              background: "#A52C50",
              padding: "0.75rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Попробовать снова
          </button>
        </div>
      </body>
    </html>
  );
}

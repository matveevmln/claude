/**
 * Structured logging + error reporting hook. Ships as console-based JSON
 * so logs are grep/parse-able in any hosting provider's log viewer; wire
 * `reportError` to Sentry/Bugsnag/etc by setting SENTRY_DSN and filling
 * in the marked spot below — every call site funnels through here so
 * that's a one-file change, not a repo-wide refactor.
 */
type LogContext = Record<string, unknown>;

function emit(level: "info" | "warn" | "error", message: string, context?: LogContext) {
  const line = { level, message, timestamp: new Date().toISOString(), ...context };
  const method = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
  method(JSON.stringify(line));
}

export const logger = {
  info: (message: string, context?: LogContext) => emit("info", message, context),
  warn: (message: string, context?: LogContext) => emit("warn", message, context),
  error: (message: string, context?: LogContext) => emit("error", message, context),
};

/**
 * Call this for errors that represent a real operational problem worth
 * paging someone for (payment/webhook failures, DB errors) — as opposed
 * to expected control flow (invalid input, 404s).
 */
export function reportError(context: string, error: unknown, extra?: LogContext) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  logger.error(`[${context}] ${message}`, { stack, ...extra });

  if (process.env.SENTRY_DSN) {
    // Hook point: `Sentry.captureException(error, { tags: { context }, extra })`
    // once @sentry/nextjs is installed and initialized.
  }
}

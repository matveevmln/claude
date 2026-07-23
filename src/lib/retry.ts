/**
 * Retries a transient-failure-prone async operation with exponential
 * backoff. Used for outbound calls to third-party APIs (email, Telegram,
 * ad-pixel conversions) where a single network blip shouldn't be treated
 * the same as a permanent failure.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  { attempts = 3, baseDelayMs = 300, label = "operation" }: { attempts?: number; baseDelayMs?: number; label?: string } = {}
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < attempts) {
        const delay = baseDelayMs * 2 ** (attempt - 1);
        console.warn(`[retry] ${label} failed (attempt ${attempt}/${attempts}), retrying in ${delay}ms`, err);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  console.error(`[retry] ${label} failed after ${attempts} attempts`, lastError);
  throw lastError;
}

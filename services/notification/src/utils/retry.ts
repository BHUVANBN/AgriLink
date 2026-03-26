/**
 * Notification Service - Retry Utility 📬
 */

export interface RetryResult<T> {
  result?: T;
  error?: string;
  attempts: number;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 500
): Promise<RetryResult<T>> {
  let lastError: any;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      return { result, attempts: attempt };
    } catch (err: any) {
      lastError = err;
      if (attempt < maxRetries) {
        // Exponential back-off
        await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, attempt - 1)));
      }
    }
  }
  return { error: lastError?.message ?? 'Unknown error', attempts: maxRetries };
}

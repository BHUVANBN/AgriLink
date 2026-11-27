/**
 * Transparent session refresh for every API call.
 *
 * Access tokens are short-lived (15 min). Instead of touching every one of
 * the ~100 fetch() calls in the app, we wrap window.fetch once: when an API
 * request comes back 401, we call POST /auth/refresh (deduplicated across
 * concurrent requests) and replay the original request once.
 */

const SKIP = /\/auth\/(refresh|login|logout|register|verify-otp|resend-otp|forgot-password|reset-password)/;

let installed = false;
let inflight: Promise<boolean> | null = null;

export function installAuthRefresh(apiBase: string) {
  if (typeof window === 'undefined' || installed) return;
  installed = true;

  const originalFetch = window.fetch.bind(window);

  const refresh = () => {
    if (!inflight) {
      inflight = originalFetch(`${apiBase}/auth/refresh`, { method: 'POST', credentials: 'include' })
        .then((r) => r.ok)
        .catch(() => false)
        .finally(() => {
          // Allow a fresh attempt on the next 401 burst
          setTimeout(() => { inflight = null; }, 0);
        });
    }
    return inflight;
  };

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await originalFetch(input, init);
    if (response.status !== 401) return response;

    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    if (!url.startsWith(apiBase) || SKIP.test(url)) return response;

    // A consumed Request object can't be replayed safely
    if (typeof input !== 'string' && !(input instanceof URL)) return response;

    const ok = await refresh();
    return ok ? originalFetch(input, init) : response;
  };
}

import { useEffect } from 'react';

// Render Free sleeps after about 15 idle minutes and a cold start takes up to a minute. Form pages
// (signup, become-guide, early-access) ping the API's /healthz on mount so it is awake by the time
// the user submits. /healthz is an in-memory snapshot outside /api, so no limiter, logger, or
// database sees it. It sends no CORS headers, so the ping is `no-cors`: it still reaches Render and
// the page never reads the response. A failed ping is ignored; it must never affect the page.
//
// The API base is passed in (pages use API_BASE from apiClient) so this module stays importable
// under `node --test`.
const WARM_INTERVAL_MS = 5 * 60 * 1000;
let lastWarmAt: number | null = null;

export function warmApi(
  apiBase: string,
  fetcher: typeof fetch = fetch,
  now: number = Date.now()
): void {
  if (lastWarmAt !== null && now - lastWarmAt < WARM_INTERVAL_MS) return;
  lastWarmAt = now;
  fetcher(`${apiBase.replace(/\/+$/, '')}/healthz`, {
    mode: 'no-cors',
    cache: 'no-store',
    credentials: 'omit',
  }).catch(() => undefined);
}

export function useWarmApi(apiBase: string): void {
  useEffect(() => {
    warmApi(apiBase);
  }, [apiBase]);
}

export function resetWarmApiForTests(): void {
  lastWarmAt = null;
}

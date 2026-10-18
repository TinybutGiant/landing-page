// Origin of this guide landing site. Only used as a fallback when `window`
// is unavailable (e.g. tests); in the browser we use window.location.origin.
export const CANONICAL_GUIDE_ORIGIN = 'https://guide.ahhh-yaotu.com';
export const CANONICAL_PRODUCTION_API_ORIGIN = 'https://api.ahhh-yaotu.com';
export const CANONICAL_PRODUCTION_WEB_ORIGIN = 'https://www.ahhh-yaotu.com';

export function normalizeConfiguredOrigin(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    if (url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

export function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

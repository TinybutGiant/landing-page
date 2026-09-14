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

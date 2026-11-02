/**
 * Read the single-use token from the URL fragment (#token=...).
 * Fragments are never sent to the server, so the token stays out of
 * server access logs.
 */
export function readFragmentToken(): string | null {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return params.get("token")?.trim() || null;
}

const POST_EMAIL_VERIFICATION_REDIRECT_KEY = "postEmailVerificationRedirect";

function currentOrigin(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return "https://guide.ahhh-yaotu.com";
}

export function sanitizeSameOriginRedirect(
  raw: string | null | undefined,
  fallback: string | null = null
): string | null {
  const value = raw?.trim();
  if (!value) return fallback;

  try {
    const origin = currentOrigin();
    const url = new URL(value, origin);
    if (url.origin !== origin) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function readRedirectParam(fallback: string | null = null): string | null {
  if (typeof window === "undefined") return fallback;
  return sanitizeSameOriginRedirect(
    new URLSearchParams(window.location.search).get("redirect"),
    fallback
  );
}

export function rememberPostEmailVerificationRedirect(raw: string | null | undefined) {
  if (typeof window === "undefined") return null;
  const sanitized = sanitizeSameOriginRedirect(raw, null);
  if (sanitized) {
    sessionStorage.setItem(POST_EMAIL_VERIFICATION_REDIRECT_KEY, sanitized);
  } else {
    sessionStorage.removeItem(POST_EMAIL_VERIFICATION_REDIRECT_KEY);
  }
  return sanitized;
}

export function readPostEmailVerificationRedirect(fallback: string | null = null): string | null {
  if (typeof window === "undefined") return fallback;
  const fromQuery = readRedirectParam(null);
  if (fromQuery) {
    rememberPostEmailVerificationRedirect(fromQuery);
    return fromQuery;
  }
  return sanitizeSameOriginRedirect(
    sessionStorage.getItem(POST_EMAIL_VERIFICATION_REDIRECT_KEY),
    fallback
  );
}

export function clearPostEmailVerificationRedirect() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(POST_EMAIL_VERIFICATION_REDIRECT_KEY);
}

export function pathWithRedirect(path: string, redirectTo: string | null | undefined): string {
  const sanitized = sanitizeSameOriginRedirect(redirectTo, null);
  if (!sanitized) return path;
  const url = new URL(path, currentOrigin());
  url.searchParams.set("redirect", sanitized);
  return `${url.pathname}${url.search}${url.hash}`;
}

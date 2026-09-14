import { useEffect, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'wouter';
import {
  createAuthApiClient,
  resolveAuthMessage,
  type AuthLinkProps,
  type AuthLocale,
  type AuthRuntimeConfig,
  type AuthToast,
} from '@yaotu/auth';

import { useToast } from '@/hooks/use-toast';
import { API_BASE } from '@/lib/apiClient';
import {
  CANONICAL_PRODUCTION_WEB_ORIGIN,
  normalizeConfiguredOrigin,
} from '@/lib/publicOrigins';

const DEFAULT_MARKETPLACE_ORIGIN = CANONICAL_PRODUCTION_WEB_ORIGIN;
const ALLOWED_PRODUCTION_AUTH_ORIGINS = new Set([DEFAULT_MARKETPLACE_ORIGIN]);

const authApiClient = createAuthApiClient({
  apiBaseUrl: API_BASE,
  fetcher: (input, init) => globalThis.fetch(input, init),
});

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

const WouterAuthLink: ComponentType<AuthLinkProps> = ({
  href,
  className,
  children,
  ...props
}) => {
  if (isExternalHref(href)) {
    return (
      <a href={href} className={className} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
};

function getDocumentDarkMode(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

function useDocumentDarkMode(): boolean {
  const [darkMode, setDarkMode] = useState(getDocumentDarkMode);

  useEffect(() => {
    if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
      return;
    }

    const updateDarkMode = () => setDarkMode(getDocumentDarkMode());
    updateDarkMode();

    const observer = new MutationObserver(updateDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return darkMode;
}

function normalizeAuthLocale(locale: string): AuthLocale {
  if (locale === 'zh-CN' || locale.toLowerCase().startsWith('zh')) return 'zh-CN';
  if (locale.toLowerCase().startsWith('ja')) return 'ja';
  return 'en';
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

export function getCanonicalAuthOrigin(): string {
  const candidate = trimTrailingSlash(
    import.meta.env.VITE_AUTH_ORIGIN ||
      import.meta.env.VITE_MARKETPLACE_ORIGIN ||
      DEFAULT_MARKETPLACE_ORIGIN
  );
  const url = new URL(candidate);
  const isLocalDevelopment =
    !import.meta.env.PROD &&
    (url.hostname === 'localhost' || url.hostname === '127.0.0.1');
  if (
    url.username ||
    url.password ||
    (!isLocalDevelopment && url.protocol !== 'https:') ||
    (import.meta.env.PROD && !ALLOWED_PRODUCTION_AUTH_ORIGINS.has(url.origin))
  ) {
    throw new Error('VITE_AUTH_ORIGIN must be an allowlisted canonical HTTPS origin.');
  }
  return url.origin;
}

export function getCanonicalVerifyEmailPath(redirectTo?: string | null): string {
  const url = new URL("/verify-email", getCanonicalAuthOrigin());
  if (redirectTo?.trim()) {
    url.searchParams.set("redirect", redirectTo.trim());
  }
  return url.toString();
}

export function addSignupEmailPrefillFragment(
  verifyEmailPath: string,
  submittedEmail: string
): string {
  const url = new URL(verifyEmailPath, getCanonicalAuthOrigin());
  if (url.origin !== getCanonicalAuthOrigin()) {
    throw new Error('Verification email prefill may only target the canonical auth origin.');
  }

  const email = submittedEmail.trim();
  if (!email || email.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return url.toString();
  }

  const fragment = new URLSearchParams(url.hash.replace(/^#/, ''));
  fragment.set('signupEmail', email);
  url.hash = fragment.toString();
  return url.toString();
}

export function getMarketplaceOrigin(): string {
  const candidate = trimTrailingSlash(
    import.meta.env.VITE_MARKETPLACE_ORIGIN || DEFAULT_MARKETPLACE_ORIGIN
  );
  if (
    import.meta.env.PROD &&
    normalizeConfiguredOrigin(candidate) !== CANONICAL_PRODUCTION_WEB_ORIGIN
  ) {
    throw new Error(
      `VITE_MARKETPLACE_ORIGIN must be ${CANONICAL_PRODUCTION_WEB_ORIGIN} in production.`
    );
  }
  return candidate;
}

export function getMarketplaceUrl(path: string): string {
  return `${getMarketplaceOrigin()}/${path.replace(/^\/+/, '')}`;
}

export function useYaoTuAuthRuntime(): Pick<
  AuthRuntimeConfig,
  'apiClient' | 't' | 'toast' | 'navigate' | 'LinkComponent' | 'darkMode'
> {
  const intl = useIntl();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const darkMode = useDocumentDarkMode();
  const authLocale = normalizeAuthLocale(intl.locale);

  return useMemo(
    () => ({
      apiClient: authApiClient,
      t: (
        key: string,
        values?: Record<string, string | number | null | undefined>,
        defaultMessage?: string
      ) =>
        intl.formatMessage(
          {
            id: `auth.${key}`,
            defaultMessage: resolveAuthMessage(
              key,
              authLocale,
              undefined,
              undefined,
              defaultMessage
            ),
          },
          values
        ),
      toast: (authToast: AuthToast) => {
        toast(authToast);
      },
      navigate: (href: string) => {
        if (isExternalHref(href)) {
          window.location.assign(href);
          return;
        }
        setLocation(href);
      },
      LinkComponent: WouterAuthLink,
      darkMode,
    }),
    [authLocale, darkMode, intl, setLocation, toast]
  );
}

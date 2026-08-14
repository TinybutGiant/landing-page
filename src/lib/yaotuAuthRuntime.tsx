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

const DEFAULT_MARKETPLACE_ORIGIN = 'https://www.ahhh-yaotu.com';

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
  return trimTrailingSlash(
    import.meta.env.VITE_AUTH_ORIGIN ||
      import.meta.env.VITE_MARKETPLACE_ORIGIN ||
      DEFAULT_MARKETPLACE_ORIGIN
  );
}

export function getCanonicalVerifyEmailPath(redirectTo?: string | null): string {
  const url = new URL("/verify-email", getCanonicalAuthOrigin());
  if (redirectTo?.trim()) {
    url.searchParams.set("redirect", redirectTo.trim());
  }
  return url.toString();
}

export function getMarketplaceOrigin(): string {
  return trimTrailingSlash(
    import.meta.env.VITE_MARKETPLACE_ORIGIN || DEFAULT_MARKETPLACE_ORIGIN
  );
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

import { useEffect, useMemo, useState } from 'react';
import { SignUpForm } from '@yaotu/auth';
import { GUIDE_APPLICATION_IDENTITY_INTENT_STORAGE_KEY } from '@replit/guide-form';
import { useLocation } from 'wouter';

import { useAuth } from '@/context/AuthContext';
import { readRedirectParam, rememberPostEmailVerificationRedirect } from '@/lib/authRedirects';
import { useLanguage } from '@/i18n/LanguageProvider';
import {
  getCanonicalVerifyEmailPath,
  getMarketplaceUrl,
  useYaoTuAuthRuntime,
} from '@/lib/yaotuAuthRuntime';
import { resolveApiUrl } from '@/lib/apiClient';

const DEFAULT_REDIRECT = '/become-guide';
type IntentStatus = 'none' | 'checking' | 'valid' | 'invalid';

const guideUrl = (path: string): string => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://guide.ahhh-yaotu.com';
  return new URL(path, origin).toString();
};

const guideLoginContinuation = (redirectTo: string | null): string => {
  const loginUrl = new URL('/login', guideUrl('/'));
  loginUrl.searchParams.set('redirect', redirectTo ?? DEFAULT_REDIRECT);
  return loginUrl.toString();
};

function readSignupIntentParam(): string | null {
  if (typeof window === 'undefined') return null;
  const value = new URLSearchParams(window.location.search).get('intent')?.trim();
  if (value) return value;
  return sessionStorage.getItem(GUIDE_APPLICATION_IDENTITY_INTENT_STORAGE_KEY)?.trim() || null;
}

function PreLaunchSignupGate({ invalidIntent = false }: { invalidIntent?: boolean }) {
  const { locale } = useLanguage();
  const travelerWaitlistUrl = getMarketplaceUrl(
    `/signup?locale=${encodeURIComponent(locale)}`
  );

  return (
    <main className="min-h-screen bg-white px-4 py-12 text-gray-900">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#B88A00]">
            Pre-launch access
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Yaotu account creation opens through the Guide application checkpoint.
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-600">
            Travelers can join early access without creating an account. Guide applicants should
            start the guide application and create an account at the onboarding checkpoint.
          </p>
          {invalidIntent && (
            <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              This guide application account link has expired or was already used. Continue from
              your guide application to request a new link.
            </p>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
            <h2 className="text-xl font-semibold">Join the Traveler Waitlist</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Traveler early access is handled on the main Yaotu site.
            </p>
            <a
              href={travelerWaitlistUrl}
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[#FFD511] px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-[#e9c20f]"
            >
              Join Waitlist
            </a>
          </div>

          <div className="rounded-lg border border-gray-200 p-5">
            <h2 className="text-xl font-semibold">Apply as a Guide</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Start the application first. Account setup appears only when your guide application
              reaches the identity checkpoint.
            </p>
            <a
              href="/become-guide"
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold hover:border-[#B88A00] hover:text-[#B88A00]"
            >
              Become a Guide
            </a>
            <a
              href="/login"
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-gray-600 hover:text-[#B88A00]"
            >
              Existing user sign in
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

const SignupPage = () => {
  const runtime = useYaoTuAuthRuntime();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const redirectTo = useMemo(() => readRedirectParam(DEFAULT_REDIRECT), []);
  const signupIntentToken = useMemo(readSignupIntentParam, []);
  const [intentStatus, setIntentStatus] = useState<IntentStatus>(
    signupIntentToken ? 'checking' : 'none'
  );

  useEffect(() => {
    if (!signupIntentToken || typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    if (!url.searchParams.has('intent')) return;

    sessionStorage.setItem(GUIDE_APPLICATION_IDENTITY_INTENT_STORAGE_KEY, signupIntentToken);
    url.searchParams.delete('intent');
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }, [signupIntentToken]);

  useEffect(() => {
    if (!user) return;
    setLocation(redirectTo ?? DEFAULT_REDIRECT);
  }, [redirectTo, setLocation, user]);

  useEffect(() => {
    if (!signupIntentToken) {
      setIntentStatus('none');
      return;
    }

    let cancelled = false;
    setIntentStatus('checking');
    void fetch(resolveApiUrl('/api/v2/guide-signup-intents/validate'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signupIntentToken }),
    })
      .then((response) => {
        if (cancelled) return;
        if (!response.ok) {
          sessionStorage.removeItem(GUIDE_APPLICATION_IDENTITY_INTENT_STORAGE_KEY);
        }
        setIntentStatus(response.ok ? 'valid' : 'invalid');
      })
      .catch(() => {
        if (!cancelled) {
          sessionStorage.removeItem(GUIDE_APPLICATION_IDENTITY_INTENT_STORAGE_KEY);
          setIntentStatus('invalid');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [signupIntentToken]);

  if (intentStatus === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4 text-gray-900">
        <p className="text-sm text-gray-600">Checking account link...</p>
      </main>
    );
  }

  if (intentStatus !== 'valid') {
    return <PreLaunchSignupGate invalidIntent={intentStatus === 'invalid'} />;
  }

  return (
    <SignUpForm
      {...runtime}
      redirectTo={redirectTo}
      readRedirectParam={false}
      signupIntentToken={signupIntentToken}
      loginPath="/login"
      verifyEmailPath={getCanonicalVerifyEmailPath(guideLoginContinuation(redirectTo))}
      termsPath="/terms"
      privacyPath="/privacy"
      onSignupVerificationRequired={(_result, context) => {
        // Verification continues on the main origin, whose sessionStorage is
        // isolated from this landing origin. Do not retain a raw email here.
        sessionStorage.removeItem('pendingEmailVerificationIdentifier');
        sessionStorage.removeItem('pendingEmailVerificationDestination');
        rememberPostEmailVerificationRedirect(context.redirectTo ?? redirectTo);
      }}
    />
  );
};

export default SignupPage;

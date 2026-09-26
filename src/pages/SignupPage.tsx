import { useEffect, useMemo, useState } from 'react';
import { SignUpForm } from '@yaotu/auth';
import { GUIDE_APPLICATION_IDENTITY_INTENT_STORAGE_KEY } from '@replit/guide-form';
import { useLocation } from 'wouter';

import YaotuAppChrome from '@/components/YaotuAppChrome';
import { useAuth } from '@/context/AuthContext';
import { readRedirectParam, rememberPostEmailVerificationRedirect } from '@/lib/authRedirects';
import {
  addSignupEmailPrefillFragment,
  getCanonicalVerifyEmailPath,
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
  return (
    <div className="become-guide-page min-h-screen">
      <div className="become-guide-orb" aria-hidden />
      <YaotuAppChrome title="Yaotu account" />
      <main className="guide-form-stage mx-auto w-full max-w-5xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
        <div className="mx-auto max-w-[56rem]">
          <h1>Yaotu account creation opens through the Guide application checkpoint.</h1>
          <p>
            Travelers can join early access without creating an account. Guide applicants should
            start the guide application and create an account at the onboarding checkpoint.
          </p>
          {invalidIntent && (
            <p className="early-access-notice" role="alert">
              This guide application account link has expired or was already used. Continue from
              your guide application to request a new link.
            </p>
          )}
          <div className="early-access-split">
            <section className="early-access-card">
              <h2>Join Traveler Early Access</h2>
              <p>Traveler early access uses the same landing-page form as the homepage CTA.</p>
              <a href="/early-access" className="yaotu-button mt-5 inline-flex min-h-12 w-full px-6">
                Get Traveler Early Access
              </a>
            </section>
            <section className="early-access-card">
              <h2>Apply as a Guide</h2>
              <p>
                Start the application first. Account setup appears only when your guide application
                reaches the identity checkpoint.
              </p>
              <a href="/become-guide" className="yaotu-secondary-button mt-5 inline-flex min-h-12 w-full px-6">
                Become a Local Guide
              </a>
              <a href="/login" className="mt-3 inline-flex min-h-12 w-full items-center justify-center px-4 text-sm font-bold text-[#625f55] hover:text-[#171714]">
                Existing user sign in
              </a>
            </section>
          </div>
        </div>
      </main>
    </div>
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
      <div className="become-guide-page flex min-h-screen items-center justify-center px-4">
        <p className="text-sm font-medium text-[#625f55]">Checking account link...</p>
      </div>
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
      signupConsumer="guide"
      loginPath="/login"
      verifyEmailPath={getCanonicalVerifyEmailPath(guideLoginContinuation(redirectTo))}
      resolveVerifyEmailPath={addSignupEmailPrefillFragment}
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

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { SignUpForm } from '@yaotu/auth';
import { useLocation } from 'wouter';

import { useAuth } from '@/context/AuthContext';
import { readRedirectParam } from '@/lib/authRedirects';
import { getCanonicalVerifyEmailPath, useYaoTuAuthRuntime } from '@/lib/yaotuAuthRuntime';
import { api, resolveApiUrl } from '@/lib/apiClient';

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
  return value || null;
}

function PreLaunchSignupGate({ invalidIntent = false }: { invalidIntent?: boolean }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWaitlistSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      await api.post('/api/v2/waitlist', {
        name: name.trim(),
        email: email.trim(),
        source: 'guide_signup_gate',
      });
      setSubmitted(true);
    } catch {
      setError("We couldn't submit your request. Please check your email and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-4 py-12 text-gray-900">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#B88A00]">
            Pre-launch access
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Yaotu account creation opens through guide onboarding.
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-600">
            Travelers can join early access without creating an account. Guide applicants should
            start the guide application and create an account at the onboarding checkpoint.
          </p>
          {invalidIntent && (
            <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              This guide signup link has expired or was already used. Continue from your guide
              application to request a new link.
            </p>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
            <h2 className="text-xl font-semibold">Join the Traveler Waitlist</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Get notified when traveler marketplace access opens.
            </p>
            {submitted ? (
              <p className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                Check your inbox to confirm your waitlist spot.
              </p>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="mt-5 space-y-3">
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Name"
                  className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#FFD511] focus:ring-2 focus:ring-[#FFD511]/40"
                />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#FFD511] focus:ring-2 focus:ring-[#FFD511]/40"
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="min-h-11 w-full rounded-md bg-[#FFD511] px-4 py-2 text-sm font-semibold text-gray-900 disabled:opacity-60"
                >
                  {submitting ? 'Submitting...' : 'Join Waitlist'}
                </button>
              </form>
            )}
          </div>

          <div className="rounded-lg border border-gray-200 p-5">
            <h2 className="text-xl font-semibold">Apply as a Guide</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Start the application first. The account setup step appears after the initial guide
              onboarding checkpoint.
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
        setIntentStatus(response.ok ? 'valid' : 'invalid');
      })
      .catch(() => {
        if (!cancelled) setIntentStatus('invalid');
      });

    return () => {
      cancelled = true;
    };
  }, [signupIntentToken]);

  if (intentStatus === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4 text-gray-900">
        <p className="text-sm text-gray-600">Checking signup link...</p>
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
      signupIntentToken={signupIntentToken}
      readRedirectParam={false}
      loginPath="/login"
      verifyEmailPath={getCanonicalVerifyEmailPath(guideLoginContinuation(redirectTo))}
      termsPath="/terms"
      privacyPath="/privacy"
    />
  );
};

export default SignupPage;

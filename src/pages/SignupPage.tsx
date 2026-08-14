import { useEffect, useMemo } from 'react';
import { SignUpForm } from '@yaotu/auth';
import { useLocation } from 'wouter';

import { useAuth } from '@/context/AuthContext';
import { readRedirectParam } from '@/lib/authRedirects';
import { getCanonicalVerifyEmailPath, useYaoTuAuthRuntime } from '@/lib/yaotuAuthRuntime';

const DEFAULT_REDIRECT = '/become-guide';

const guideUrl = (path: string): string => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://guide.ahhh-yaotu.com';
  return new URL(path, origin).toString();
};

const guideLoginContinuation = (redirectTo: string | null): string => {
  const loginUrl = new URL('/login', guideUrl('/'));
  loginUrl.searchParams.set('redirect', redirectTo ?? DEFAULT_REDIRECT);
  return loginUrl.toString();
};

const SignupPage = () => {
  const runtime = useYaoTuAuthRuntime();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const redirectTo = useMemo(() => readRedirectParam(DEFAULT_REDIRECT), []);

  useEffect(() => {
    if (!user) return;
    setLocation(redirectTo ?? DEFAULT_REDIRECT);
  }, [redirectTo, setLocation, user]);

  return (
    <SignUpForm
      {...runtime}
      redirectTo={redirectTo}
      readRedirectParam={false}
      loginPath="/login"
      verifyEmailPath={getCanonicalVerifyEmailPath(guideLoginContinuation(redirectTo))}
      termsPath="/terms"
      privacyPath="/privacy"
    />
  );
};

export default SignupPage;

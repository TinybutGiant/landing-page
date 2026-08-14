import { useEffect, useMemo } from 'react';
import { SignInForm } from '@yaotu/auth';
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

const LoginPage = () => {
  const runtime = useYaoTuAuthRuntime();
  const { completeAuthSession, user } = useAuth();
  const [, setLocation] = useLocation();
  const redirectTo = useMemo(() => readRedirectParam(DEFAULT_REDIRECT), []);

  useEffect(() => {
    if (!user) return;
    setLocation(redirectTo ?? DEFAULT_REDIRECT);
  }, [redirectTo, setLocation, user]);

  return (
    <SignInForm
      {...runtime}
      redirectTo={redirectTo}
      readRedirectParam={false}
      signUpPath="/signup"
      forgotPasswordPath="/forgot-password"
      defaultRedirectPath="/become-guide"
      guideRedirectPath="/become-guide"
      onAuthenticated={async (result) => {
        await completeAuthSession(result);
      }}
      onEmailVerificationRequired={() => {
        window.location.assign(getCanonicalVerifyEmailPath(guideLoginContinuation(redirectTo)));
      }}
    />
  );
};

export default LoginPage;

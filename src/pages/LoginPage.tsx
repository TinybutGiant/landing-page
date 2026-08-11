import { useEffect, useMemo } from 'react';
import { SignInForm } from '@yaotu/auth';
import { useLocation } from 'wouter';

import { useAuth } from '@/context/AuthContext';
import { getCanonicalVerifyEmailPath, useYaoTuAuthRuntime } from '@/lib/yaotuAuthRuntime';

function readRedirectParam(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('redirect');
}

const LoginPage = () => {
  const runtime = useYaoTuAuthRuntime();
  const { completeAuthSession, user } = useAuth();
  const [, setLocation] = useLocation();
  const redirectTo = useMemo(readRedirectParam, []);

  useEffect(() => {
    if (!user) return;
    setLocation(redirectTo ?? '/become-guide');
  }, [redirectTo, setLocation, user]);

  return (
    <SignInForm
      {...runtime}
      signUpPath="/signup"
      forgotPasswordPath="/forgot-password"
      defaultRedirectPath="/become-guide"
      guideRedirectPath="/become-guide"
      onAuthenticated={async (result) => {
        await completeAuthSession(result);
      }}
      onEmailVerificationRequired={() => {
        window.location.assign(getCanonicalVerifyEmailPath());
      }}
    />
  );
};

export default LoginPage;

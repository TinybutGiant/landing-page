import { useEffect, useMemo } from 'react';
import { SignUpForm } from '@yaotu/auth';
import { useLocation } from 'wouter';

import { useAuth } from '@/context/AuthContext';
import { getCanonicalVerifyEmailPath, useYaoTuAuthRuntime } from '@/lib/yaotuAuthRuntime';

function readRedirectParam(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('redirect');
}

const SignupPage = () => {
  const runtime = useYaoTuAuthRuntime();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const redirectTo = useMemo(readRedirectParam, []);

  useEffect(() => {
    if (!user) return;
    setLocation(redirectTo ?? '/become-guide');
  }, [redirectTo, setLocation, user]);

  return (
    <SignUpForm
      {...runtime}
      redirectTo={redirectTo}
      loginPath="/login"
      verifyEmailPath={getCanonicalVerifyEmailPath()}
      termsPath="/terms"
      privacyPath="/privacy"
    />
  );
};

export default SignupPage;

import React from 'react';
import SignupForm from '@/components/auth/SignupForm';

const SignupPage: React.FC = () => {
  // Extract redirect parameter from URL
  const urlParams = new URLSearchParams(window.location.search);
  const redirectTo = urlParams.get('redirect');

  return <SignupForm redirectTo={redirectTo || undefined} />;
};

export default SignupPage;

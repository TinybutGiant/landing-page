import React from 'react';
import LoginForm from '@/components/auth/LoginForm';

const LoginPage: React.FC = () => {
  // Extract redirect parameter from URL
  const urlParams = new URLSearchParams(window.location.search);
  const redirectTo = urlParams.get('redirect');

  return <LoginForm redirectTo={redirectTo || undefined} />;
};

export default LoginPage;

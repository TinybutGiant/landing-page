import { ResetPasswordForm } from '@yaotu/auth';

import { useYaoTuAuthRuntime } from '@/lib/yaotuAuthRuntime';

const ResetPasswordPage = () => {
  const runtime = useYaoTuAuthRuntime();
  return (
    <ResetPasswordForm
      {...runtime}
      loginPath="/login"
      forgotPasswordPath="/forgot-password"
      autoRedirectMs={3000}
    />
  );
};

export default ResetPasswordPage;

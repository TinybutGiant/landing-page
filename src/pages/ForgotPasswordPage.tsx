import { ForgotPasswordForm } from '@yaotu/auth';

import { useYaoTuAuthRuntime } from '@/lib/yaotuAuthRuntime';

const ForgotPasswordPage = () => {
  const runtime = useYaoTuAuthRuntime();
  return <ForgotPasswordForm {...runtime} loginPath="/login" />;
};

export default ForgotPasswordPage;

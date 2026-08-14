import type { GuideFormConfig } from "../types/schema";

export const DEFAULT_RESUME_PATH = "/become-guide?resume=1";

export const getResumePath = (config: GuideFormConfig) =>
  config.routes?.resumePath ?? DEFAULT_RESUME_PATH;

const appendRedirectParam = (path: string, redirectTo: string) => {
  const base =
    typeof window !== "undefined" ? window.location.origin : "https://guide.ahhh-yaotu.com";
  const url = new URL(path, base);
  url.searchParams.set("redirect", redirectTo);

  if (/^https?:\/\//i.test(path)) {
    return url.toString();
  }

  return `${url.pathname}${url.search}${url.hash}`;
};

export const getAuthRedirectUrl = (config: GuideFormConfig) => {
  const resumePath = getResumePath(config);
  const signupPath = config.routes?.signup ?? "/signup";
  return appendRedirectParam(signupPath, resumePath);
};

export const getVerificationRedirectUrl = (config: GuideFormConfig) => {
  const resumePath = getResumePath(config);
  const verifyPath = config.routes?.verifyEmail ?? "/verify-email";
  return appendRedirectParam(verifyPath, resumePath);
};

export const isAuthenticated = (config: GuideFormConfig) =>
  Boolean(config.auth.getToken() && config.auth.getUserId());

export const isEmailVerified = (config: GuideFormConfig) => {
  if (config.auth.isEmailVerified) return config.auth.isEmailVerified();
  const user = config.auth.getUser?.();
  if (!config.auth.getUser) return true;
  if (!user) return false;
  return user.emailVerified === true || user.emailverified === true;
};

export const navigateToAuth = (config: GuideFormConfig) => {
  const redirectTo = getResumePath(config);
  if (config.callbacks.onAuthRequired) {
    config.callbacks.onAuthRequired(redirectTo);
    return;
  }
  if (typeof window !== "undefined") {
    window.location.href = getAuthRedirectUrl(config);
  }
};

export const navigateToVerification = (config: GuideFormConfig) => {
  const redirectTo = getResumePath(config);
  if (config.callbacks.onVerificationRequired) {
    config.callbacks.onVerificationRequired(redirectTo);
    return;
  }
  if (typeof window !== "undefined") {
    window.location.href = getVerificationRedirectUrl(config);
  }
};

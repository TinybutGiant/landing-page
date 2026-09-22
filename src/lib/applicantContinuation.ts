import type { GuideApplicationContinuationIntent } from "@replit/guide-form";

export type ApplicantContinuationIntent = Exclude<
  GuideApplicationContinuationIntent,
  "guide_home"
>;

export type ApplicantApplicationState = {
  hasApplication: boolean;
  applicationStatus?: string | null;
};

export function resolveApplicantContinuation({
  hasApplication,
  applicationStatus,
}: ApplicantApplicationState): ApplicantContinuationIntent {
  if (applicationStatus === "drafted") return "continue_server_draft";
  if (applicationStatus === "needs_more_info") return "continue_required_changes";

  if (hasApplication || applicationStatus) return "view_status";

  return "start_application";
}

export function getApprovedGuideLoginPath(): string {
  const search = new URLSearchParams({ redirect: "/guide-dashboard" });
  return `/login?${search.toString()}`;
}

export type GuideFormGateInput = {
    authLoading: boolean;
    hasUser: boolean;
    isStatePending: boolean;
    isStateFetching: boolean;
    isLeavingGuideForm: boolean;
  };
  
  /**
   * Whether BecomeGuidePage should render nothing instead of GuideForm.
   *
   * Only the first load of the application state may hold the form. A background
   * refetch (e.g. after the network reconnects) must not, otherwise GuideForm
   * unmounts and unsaved input is lost. The redirect effect still runs once the
   * refetch settles, so a submitted application still leaves the form.
   */
export function shouldHoldGuideForm(input: GuideFormGateInput): boolean {
    if (input.authLoading) return true;
    if (input.isLeavingGuideForm) return true;
    return input.hasUser && input.isStatePending;
}

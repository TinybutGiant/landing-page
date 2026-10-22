import { FormEvent, useState } from "react";

import YaotuAppChrome from "@/components/YaotuAppChrome";
import { useLanguage } from "@/i18n/LanguageProvider";
import { API_BASE, api } from "@/lib/apiClient";
import { useWarmApi } from "@/lib/warmApi";
import { CANONICAL_PRODUCTION_WEB_ORIGIN } from "@/lib/publicOrigins";

const EarlyAccessPage = () => {
  useWarmApi(API_BASE);
  const { messages, locale } = useLanguage();
  const t = (key: string, fallback: string) => messages[key] || fallback;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // Both ticks are required by the API (YaoTu privacy policy sections 7 and 11).
  const [consentTransfer, setConsentTransfer] = useState(false);
  const [consentAdult, setConsentAdult] = useState(false);
  const consented = consentTransfer && consentAdult;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !consented || submitting) return;

    setError(null);
    setSubmitting(true);
    try {
      const params = new URLSearchParams(window.location.search);
      await api.post("/api/v2/waitlist", {
        name: name.trim(),
        email: email.trim(),
        locale,
        source: "guide_landing",
        utmSource: params.get("utm_source"),
        utmMedium: params.get("utm_medium"),
        utmCampaign: params.get("utm_campaign"),
        consents: { crossBorderTransfer: true, adult: true },
      });
    } catch (submitError) {
      if ((submitError as { status?: number }).status === 503) {
        setError(
          t(
            "landing.waitlist.busy",
            "Many people are signing up right now. Please try again in a few minutes."
          )
        );
        return;
      }
      setError(
        t(
          "landing.waitlist.error",
          "We couldn't submit your request. Please check your email address and try again."
        )
      );
      return;
    } finally {
      setSubmitting(false);
    }
    setSubmitted(true);
  };

  return (
    <div className="become-guide-page early-access-page min-h-screen overflow-x-hidden">
      <div className="become-guide-orb" aria-hidden />
      <YaotuAppChrome
        title={t("landing.hero.waitlistCta", "Get Traveler Early Access")}
      />
      <main className="guide-form-stage mx-auto w-full max-w-5xl px-5 pb-24 pt-14 sm:px-8 sm:pt-20">
        <div className="early-access-intro mx-auto min-w-0 w-full max-w-[56rem]">
          <h1>
            {t("landing.waitlist.title", "Get Traveler Early Access for Japan")}
          </h1>
          <p>
            {t(
              "landing.waitlist.subtitle",
              "We're building our first community of trusted local Guides in Japan. Once they're ready to welcome Travelers, we'll invite confirmed Early Access members to experience Yaotu first."
            )}
          </p>

          <div className="early-access-split">
            <section className="early-access-card">
              <div className="early-access-card-copy">
                <h2>{t("landing.waitlist.joinTitle", "Join the Traveler Waitlist")}</h2>
                {submitted ? (
                  <>
                    <p>
                      {t(
                        "landing.waitlist.successTitle",
                        "Confirm your email"
                      )}
                    </p>
                    <p>
                      {t(
                        "landing.waitlist.successBody",
                        "We've sent a confirmation email. After you confirm, we'll prioritize inviting you when the first local Guide experiences in Japan are ready."
                      )}
                    </p>
                  </>
                ) : (
                  <p>{t("landing.waitlist.joinBody", "Get notified when traveler marketplace access opens.")}</p>
                )}
              </div>
              {submitted ? (
                <div className="early-access-card-actions early-access-card-footer">
                  <a href="/" className="yaotu-button inline-flex min-h-12 w-full px-6">
                    {t("landing.waitlist.backHome", "Back to home")}
                  </a>
                </div>
              ) : (
                <form className="waitlist-form early-access-card-actions" onSubmit={onSubmit}>
                  <label className="block text-left" htmlFor="waitlist-name">
                    <span className="mb-2 block text-sm font-bold text-[#171714]">
                      {t("landing.waitlist.name", "Name")}
                    </span>
                    <input
                      id="waitlist-name"
                      name="name"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="h-12 w-full rounded-[10px] border border-[#d6cfb7] bg-white px-3 text-base text-[#171714]"
                      required
                    />
                  </label>
                  <label className="block text-left" htmlFor="waitlist-email">
                    <span className="mb-2 block text-sm font-bold text-[#171714]">
                      {t("landing.waitlist.email", "Email")}
                    </span>
                    <input
                      id="waitlist-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="h-12 w-full rounded-[10px] border border-[#d6cfb7] bg-white px-3 text-base text-[#171714]"
                      required
                    />
                  </label>
                  <label className="flex items-start gap-2 text-left text-sm text-[#3b3a33]" htmlFor="waitlist-consent-transfer">
                    <input
                      id="waitlist-consent-transfer"
                      type="checkbox"
                      checked={consentTransfer}
                      onChange={(event) => setConsentTransfer(event.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0"
                    />
                    <span>
                      {t("landing.waitlist.consentTransfer", "I agree to my information being transferred to the United States for processing")}
                      {t("landing.waitlist.consentPolicyBefore", "; see the ")}
                      {/* A new tab, so the form keeps what was already filled in. */}
                      <a
                        href={`${CANONICAL_PRODUCTION_WEB_ORIGIN}/privacy`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2"
                      >
                        {t("landing.waitlist.consentPolicyLink", "Privacy Policy")}
                      </a>
                      {/* Empty in Chinese, so not through t(), which treats "" as missing. */}
                      {messages["landing.waitlist.consentPolicyAfter"] ?? "."}
                    </span>
                  </label>
                  <label className="flex items-start gap-2 text-left text-sm text-[#3b3a33]" htmlFor="waitlist-consent-adult">
                    <input
                      id="waitlist-consent-adult"
                      type="checkbox"
                      checked={consentAdult}
                      onChange={(event) => setConsentAdult(event.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0"
                    />
                    <span>{t("landing.waitlist.consentAdult", "I am 18 or older.")}</span>
                  </label>
                  {error ? (
                    <p className="early-access-notice mt-0" role="alert">
                      {error}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    className="yaotu-button min-h-12 w-full px-6"
                    disabled={submitting || !consented}
                  >
                    {submitting
                      ? t("landing.waitlist.submitting", "Submitting...")
                      : t("landing.waitlist.submit", "Get early access")}
                  </button>
                </form>
              )}
            </section>

            <section className="early-access-card">
              <div className="early-access-card-copy">
                <h2>{t("landing.waitlist.guideBoxTitle", "Apply as a Guide")}</h2>
                <p>
                  {t(
                    "landing.waitlist.guideBoxBody",
                    "Start the application first. Account setup appears only when your guide application reaches the identity checkpoint."
                  )}
                </p>
              </div>
              <div className="early-access-card-actions early-access-card-footer">
                <a
                  href="/become-guide"
                  className="yaotu-secondary-button inline-flex min-h-12 w-full px-6"
                >
                  {t("landing.hero.guideCta", "Become a Local Guide")}
                </a>
                <a
                  href="/login"
                  className="early-access-signin inline-flex min-h-12 w-full items-center justify-center px-4 text-sm font-bold text-[#625f55] hover:text-[#171714]"
                >
                  {t("landing.waitlist.existingSignIn", "Existing user sign in")}
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EarlyAccessPage;

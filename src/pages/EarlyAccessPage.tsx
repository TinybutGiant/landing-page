import { FormEvent, useState } from "react";

import YaotuAppChrome from "@/components/YaotuAppChrome";
import { useLanguage } from "@/i18n/LanguageProvider";
import { api } from "@/lib/apiClient";

const EarlyAccessPage = () => {
  const { messages, locale } = useLanguage();
  const t = (key: string, fallback: string) => messages[key] || fallback;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || submitting) return;

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
      });
    } catch {
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
    <div className="become-guide-page min-h-screen overflow-x-hidden">
      <div className="become-guide-orb" aria-hidden />
      <YaotuAppChrome
        title={t("landing.hero.waitlistCta", "Get Traveler Early Access")}
      />
      <main className="guide-form-stage mx-auto w-full max-w-5xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        <div className="mx-auto min-w-0 max-w-[56rem]">
          <h1 className="!max-w-full">
            {t("landing.waitlist.title", "Get Traveler Early Access for Japan")}
          </h1>
          <p className="!max-w-full">
            {t(
              "landing.waitlist.subtitle",
              "We're building our first community of trusted local Guides in Japan. Once they're ready to welcome Travelers, we'll invite confirmed Early Access members to experience Yaotu first."
            )}
          </p>

          <div className="early-access-split">
            <section className="early-access-card">
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
                  <a href="/" className="yaotu-button mt-5 inline-flex min-h-12 w-full px-6">
                    {t("landing.waitlist.backHome", "Back to home")}
                  </a>
                </>
              ) : (
                <>
                  <p>{t("landing.waitlist.joinBody", "Get notified when traveler marketplace access opens.")}</p>
                  <form className="waitlist-form mt-5 flex flex-col gap-4" onSubmit={onSubmit}>
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
                    {error ? (
                      <p className="early-access-notice mt-0" role="alert">
                        {error}
                      </p>
                    ) : null}
                    <button
                      type="submit"
                      className="yaotu-button min-h-12 w-full px-6"
                      disabled={submitting}
                    >
                      {submitting
                        ? t("landing.waitlist.submitting", "Submitting...")
                        : t("landing.waitlist.submit", "Get early access")}
                    </button>
                  </form>
                </>
              )}
            </section>

            <section className="early-access-card">
              <h2>{t("landing.waitlist.guideBoxTitle", "Apply as a Guide")}</h2>
              <p>
                {t(
                  "landing.waitlist.guideBoxBody",
                  "Start the application first. Account setup appears only when your guide application reaches the identity checkpoint."
                )}
              </p>
              <a
                href="/become-guide"
                className="yaotu-secondary-button mt-5 inline-flex min-h-12 w-full px-6"
              >
                {t("landing.hero.guideCta", "Become a Local Guide")}
              </a>
              <a
                href="/login"
                className="mt-3 inline-flex min-h-12 w-full items-center justify-center px-4 text-sm font-bold text-[#625f55] hover:text-[#171714]"
              >
                {t("landing.waitlist.existingSignIn", "Existing user sign in")}
              </a>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EarlyAccessPage;

import { FormEvent, useEffect, useState } from "react";

import YaotuAppChrome from "@/components/YaotuAppChrome";
import { useLanguage } from "@/i18n/LanguageProvider";
import { api } from "@/lib/apiClient";

type ConfirmState = "ready" | "confirming" | "confirmed" | "invalid";

function readFragmentToken(): string | null {
  const hash = window.location.hash.replace(/^#/, "");
  const params = new URLSearchParams(hash);
  const token = params.get("token")?.trim();
  return token || null;
}

export default function WaitlistConfirmPage() {
  const { messages } = useLanguage();
  const t = (key: string, fallback: string) => messages[key] || fallback;

  const [token, setToken] = useState<string | null>(null);
  const [state, setState] = useState<ConfirmState>("ready");
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  useEffect(() => {
    const fragmentToken = readFragmentToken();
    setToken(fragmentToken);
    if (!fragmentToken) {
      setState("invalid");
    }

    window.history.replaceState(null, document.title, "/waitlist/confirm");
  }, []);

  const confirm = async () => {
    if (!token || state === "confirming") return;

    setState("confirming");
    try {
      await api.post("/api/v2/waitlist/confirm", { token });
      setState("confirmed");
      setToken(null);
    } catch {
      setState("invalid");
    }
  };

  const resend = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || resending) return;

    setResending(true);
    setResendSent(false);
    try {
      await api.post("/api/v2/waitlist/resend-confirmation", {
        email: email.trim(),
      });
      setResendSent(true);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="become-guide-page min-h-screen overflow-x-hidden">
      <div className="become-guide-orb" aria-hidden />
      <YaotuAppChrome title={t("landing.waitlist.confirmTitle", "Confirm your email")} />
      <main className="guide-form-stage mx-auto w-full max-w-5xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        <div className="mx-auto min-w-0 max-w-[36rem]">
          {state === "confirmed" ? (
            <>
              <h1 className="!max-w-full">
                {t("landing.waitlist.confirmedTitle", "You're confirmed")}
              </h1>
              <p className="!max-w-full">
                {t(
                  "landing.waitlist.confirmedBody",
                  "You're confirmed. We'll prioritize inviting you when the first local Guide experiences in Japan are ready."
                )}
              </p>
              <a href="/" className="yaotu-button mt-10 inline-flex min-h-12 px-6">
                {t("landing.waitlist.backHome", "Back to home")}
              </a>
            </>
          ) : state === "invalid" ? (
            <>
              <h1 className="!max-w-full">
                {t(
                  "landing.waitlist.invalidTokenTitle",
                  "This confirmation link is invalid or expired"
                )}
              </h1>
              <p className="!max-w-full">
                {t(
                  "landing.waitlist.invalidTokenBody",
                  "Enter your email and we'll send a new confirmation link if your early access request is still pending."
                )}
              </p>
              <section className="early-access-card mt-10 w-full">
                <form className="waitlist-form flex flex-col gap-5" onSubmit={resend}>
                  <label className="block text-left" htmlFor="waitlist-resend-email">
                    <span className="mb-2 block text-sm font-bold text-[#171714]">
                      {t("landing.waitlist.resendEmail", "Email")}
                    </span>
                    <input
                      id="waitlist-resend-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="h-12 w-full rounded-[10px] border border-[#d6cfb7] bg-white px-3 text-base text-[#171714]"
                    />
                  </label>
                  {resendSent ? (
                    <p className="early-access-notice">
                      {t(
                        "landing.waitlist.resendSent",
                        "If that email has a pending early access request, a new link has been sent."
                      )}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={resending}
                    className="yaotu-button min-h-12 w-full self-start px-6 sm:w-auto"
                  >
                    {resending
                      ? t("landing.waitlist.resending", "Sending...")
                      : t("landing.waitlist.resendButton", "Send confirmation email")}
                  </button>
                </form>
              </section>
            </>
          ) : (
            <>
              <h1 className="!max-w-full">
                {t("landing.waitlist.confirmTitle", "Confirm your email")}
              </h1>
              <p className="!max-w-full">
                {t(
                  "landing.waitlist.confirmBody",
                  "Select Confirm my email to join Yaotu Traveler Early Access for Japan."
                )}
              </p>
              <button
                type="button"
                onClick={confirm}
                disabled={!token || state === "confirming"}
                className="yaotu-button mt-10 min-h-12 px-6"
              >
                {state === "confirming"
                  ? t("landing.waitlist.confirming", "Confirming...")
                  : t("landing.waitlist.confirmButton", "Confirm my email")}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

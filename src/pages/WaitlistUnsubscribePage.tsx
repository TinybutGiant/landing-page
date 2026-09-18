import { useEffect, useState } from "react";

import YaotuAppChrome from "@/components/YaotuAppChrome";
import { useLanguage } from "@/i18n/LanguageProvider";
import { api } from "@/lib/apiClient";

type UnsubscribeState = "ready" | "submitting" | "done" | "invalid";

function readFragmentToken(): string | null {
  const hash = window.location.hash.replace(/^#/, "");
  const params = new URLSearchParams(hash);
  const token = params.get("token")?.trim();
  return token || null;
}

export default function WaitlistUnsubscribePage() {
  const { messages } = useLanguage();
  const t = (key: string, fallback: string) => messages[key] || fallback;

  const [token, setToken] = useState<string | null>(null);
  const [state, setState] = useState<UnsubscribeState>("ready");

  useEffect(() => {
    const fragmentToken = readFragmentToken();
    setToken(fragmentToken);
    if (!fragmentToken) {
      setState("invalid");
    }

    window.history.replaceState(null, document.title, "/waitlist/unsubscribe");
  }, []);

  const unsubscribe = async () => {
    if (!token || state === "submitting") return;

    setState("submitting");
    try {
      await api.post("/api/v2/waitlist/unsubscribe", { token });
      setState("done");
      setToken(null);
    } catch {
      setState("invalid");
    }
  };

  return (
    <div className="become-guide-page min-h-screen overflow-x-hidden">
      <div className="become-guide-orb" aria-hidden />
      <YaotuAppChrome
        title={t("landing.waitlist.unsubscribeTitle", "Unsubscribe from early access updates")}
      />
      <main className="guide-form-stage mx-auto w-full max-w-5xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        <div className="mx-auto min-w-0 max-w-[36rem]">
          {state === "done" ? (
            <>
              <h1 className="!max-w-full">
                {t("landing.waitlist.unsubscribeDoneTitle", "You're unsubscribed")}
              </h1>
              <p className="!max-w-full">
                {t(
                  "landing.waitlist.unsubscribeDoneBody",
                  "You will no longer receive Yaotu early access updates."
                )}
              </p>
            </>
          ) : state === "invalid" ? (
            <>
              <h1 className="!max-w-full">
                {t(
                  "landing.waitlist.unsubscribeInvalidTitle",
                  "This unsubscribe link is invalid"
                )}
              </h1>
              <p className="!max-w-full">
                {t(
                  "landing.waitlist.unsubscribeInvalidBody",
                  "The link may be incomplete. You can ignore this page."
                )}
              </p>
            </>
          ) : (
            <>
              <h1 className="!max-w-full">
                {t(
                  "landing.waitlist.unsubscribeTitle",
                  "Unsubscribe from early access updates"
                )}
              </h1>
              <p className="!max-w-full">
                {t(
                  "landing.waitlist.unsubscribeBody",
                  "Select Unsubscribe to stop receiving future Yaotu early access updates."
                )}
              </p>
              <button
                type="button"
                onClick={unsubscribe}
                disabled={!token || state === "submitting"}
                className="yaotu-button mt-10 min-h-12 px-6"
              >
                {state === "submitting"
                  ? t("landing.waitlist.unsubscribing", "Unsubscribing...")
                  : t("landing.waitlist.unsubscribeButton", "Unsubscribe")}
              </button>
            </>
          )}
          <a href="/" className="mt-8 inline-flex min-h-12 items-center text-sm font-bold text-[#625f55] hover:text-[#171714]">
            {t("landing.waitlist.backHome", "Back to home")}
          </a>
        </div>
      </main>
    </div>
  );
}

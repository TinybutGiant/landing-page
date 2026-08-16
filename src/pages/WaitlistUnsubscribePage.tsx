import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
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
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-orange-50 px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-xl">
        {state === "done" ? (
          <>
            <CheckCircle2 className="mx-auto mb-5 h-12 w-12 text-green-600" />
            <h1 className="mb-3 text-3xl font-bold text-gray-900">
              {t("landing.waitlist.unsubscribeDoneTitle", "You're unsubscribed")}
            </h1>
            <p className="mb-8 text-gray-600">
              {t(
                "landing.waitlist.unsubscribeDoneBody",
                "You will no longer receive Yaotu early access updates."
              )}
            </p>
          </>
        ) : state === "invalid" ? (
          <>
            <XCircle className="mx-auto mb-5 h-12 w-12 text-red-600" />
            <h1 className="mb-3 text-3xl font-bold text-gray-900">
              {t("landing.waitlist.unsubscribeInvalidTitle", "This unsubscribe link is invalid")}
            </h1>
            <p className="mb-8 text-gray-600">
              {t(
                "landing.waitlist.unsubscribeInvalidBody",
                "The link may be incomplete. You can ignore this page."
              )}
            </p>
          </>
        ) : (
          <>
            <h1 className="mb-3 text-3xl font-bold text-gray-900">
              {t("landing.waitlist.unsubscribeTitle", "Unsubscribe from early access updates")}
            </h1>
            <p className="mb-8 text-gray-600">
              {t(
                "landing.waitlist.unsubscribeBody",
                "Select Unsubscribe to stop receiving future Yaotu early access updates."
              )}
            </p>
            <Button
              onClick={unsubscribe}
              disabled={!token || state === "submitting"}
              className="w-full rounded-full py-6 font-semibold"
            >
              {state === "submitting"
                ? t("landing.waitlist.unsubscribing", "Unsubscribing...")
                : t("landing.waitlist.unsubscribeButton", "Unsubscribe")}
            </Button>
          </>
        )}
        <Button asChild variant="link" className="mt-6">
          <a href="/">{t("landing.waitlist.backHome", "Back to home")}</a>
        </Button>
      </section>
    </main>
  );
}

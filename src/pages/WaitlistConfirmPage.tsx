import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, Mail, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
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
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-orange-50 px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        {state === "confirmed" ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto mb-5 h-12 w-12 text-green-600" />
            <h1 className="mb-3 text-3xl font-bold text-gray-900">
              {t("landing.waitlist.confirmedTitle", "You're confirmed")}
            </h1>
            <p className="mb-8 text-gray-600">
              {t(
                "landing.waitlist.confirmedBody",
                "You're confirmed. We'll prioritize inviting you when Yaotu opens its first traveler experience."
              )}
            </p>
            <Button asChild className="rounded-full px-8">
              <a href="/">{t("landing.waitlist.backHome", "Back to home")}</a>
            </Button>
          </div>
        ) : state === "invalid" ? (
          <div>
            <XCircle className="mb-5 h-12 w-12 text-red-600" />
            <h1 className="mb-3 text-3xl font-bold text-gray-900">
              {t(
                "landing.waitlist.invalidTokenTitle",
                "This confirmation link is invalid or expired"
              )}
            </h1>
            <p className="mb-6 text-gray-600">
              {t(
                "landing.waitlist.invalidTokenBody",
                "Enter your email and we'll send a new confirmation link if your early access request is still pending."
              )}
            </p>
            <form onSubmit={resend} className="space-y-4">
              <label
                htmlFor="waitlist-resend-email"
                className="block text-sm font-medium text-gray-700"
              >
                {t("landing.waitlist.resendEmail", "Email")}
              </label>
              <input
                id="waitlist-resend-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none focus:border-[#FFD511] focus:ring-2 focus:ring-[#FFD511]/40"
                placeholder="you@example.com"
              />
              {resendSent && (
                <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                  {t(
                    "landing.waitlist.resendSent",
                    "If that email has a pending early access request, a new link has been sent."
                  )}
                </p>
              )}
              <Button
                type="submit"
                disabled={resending}
                className="w-full rounded-full py-6 font-semibold"
              >
                {resending
                  ? t("landing.waitlist.resending", "Sending...")
                  : t("landing.waitlist.resendButton", "Send confirmation email")}
              </Button>
            </form>
          </div>
        ) : (
          <div className="text-center">
            <Mail className="mx-auto mb-5 h-12 w-12 text-yellow-500" />
            <h1 className="mb-3 text-3xl font-bold text-gray-900">
              {t("landing.waitlist.confirmTitle", "Confirm your email")}
            </h1>
            <p className="mb-8 text-gray-600">
              {t(
                "landing.waitlist.confirmBody",
                "Select Confirm my email to join the first group of Yaotu travelers."
              )}
            </p>
            <Button
              onClick={confirm}
              disabled={!token || state === "confirming"}
              className="w-full rounded-full py-6 font-semibold"
            >
              {state === "confirming"
                ? t("landing.waitlist.confirming", "Confirming...")
                : t("landing.waitlist.confirmButton", "Confirm my email")}
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}

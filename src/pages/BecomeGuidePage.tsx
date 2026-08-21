import { useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import html2pdf from "html2pdf.js";
import { ChevronLeft, ChevronRight, Info, Save } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { type IntlShape, useIntl } from "react-intl";
import { useLocation } from "wouter";
import {
  GuideForm,
  type GuideFormConfig,
  type GuideFormDestination,
  type UIComponents,
} from "@replit/guide-form";

import ApplicationQualificationUploader from "@/components/ApplicationQualificationUploader";
import { YearMonthPicker } from "@/components/YearMonthPicker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { pathWithRedirect, rememberPostEmailVerificationRedirect } from "@/lib/authRedirects";
import { apiRequest } from "@/lib/queryClient";
import { resolveApiUrl } from "@/lib/apiClient";
import { getCanonicalVerifyEmailPath } from "@/lib/yaotuAuthRuntime";

const RESUME_PATH = "/become-guide?resume=1";
const DESTINATIONS_QUERY_KEY = ["/api/v2/destinations", "JP"] as const;
const DESTINATIONS_CACHE_KEY = "yaotu_landing_destinations_JP_v1";
const DESTINATIONS_CACHE_TTL_MS = 10 * 60 * 1000;

type CachedDestinations = {
  cachedAt: number;
  destinations: GuideFormDestination[];
};

const readCachedDestinations = (): GuideFormDestination[] | undefined => {
  if (typeof window === "undefined") return undefined;

  try {
    const raw = window.sessionStorage.getItem(DESTINATIONS_CACHE_KEY);
    if (!raw) return undefined;

    const parsed = JSON.parse(raw) as CachedDestinations;
    if (
      !Array.isArray(parsed.destinations) ||
      typeof parsed.cachedAt !== "number" ||
      Date.now() - parsed.cachedAt > DESTINATIONS_CACHE_TTL_MS
    ) {
      window.sessionStorage.removeItem(DESTINATIONS_CACHE_KEY);
      return undefined;
    }

    return parsed.destinations;
  } catch {
    window.sessionStorage.removeItem(DESTINATIONS_CACHE_KEY);
    return undefined;
  }
};

const cacheDestinations = (destinations: GuideFormDestination[]) => {
  if (typeof window === "undefined") return;

  try {
    const payload: CachedDestinations = {
      cachedAt: Date.now(),
      destinations,
    };
    window.sessionStorage.setItem(DESTINATIONS_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // A missed cache write should not affect the guide application flow.
  }
};

const readInitialStep = (): "preview" | "resume" | undefined => {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  if (params.get("resume") === "1") return "resume";
  if (params.get("step") === "preview") return "preview";
  return undefined;
};

const extractApplicationId = (payload: any) =>
  payload?.application?.id ?? payload?.applicationId ?? payload?.id;

const isTokenExpiredError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;

  const errorRecord = error as Record<string, unknown>;
  const code = typeof errorRecord.code === "string" ? errorRecord.code : "";
  const message = [errorRecord.error, errorRecord.message]
    .filter((value): value is string => typeof value === "string")
    .join(" ");

  return code === "TOKEN_EXPIRED" || /token expired|expired token|log in again/i.test(message);
};

const guideUrl = (path: string): string => {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://guide.ahhh-yaotu.com";
  return new URL(path, origin).toString();
};

const guideLoginContinuation = (redirectTo: string | null | undefined): string =>
  guideUrl(pathWithRedirect("/login", redirectTo ?? RESUME_PATH));

const pathWithRedirectAndIntent = (
  path: string,
  redirectTo: string | null | undefined,
  signupIntentToken?: string | null
): string => {
  const base = pathWithRedirect(path, redirectTo);
  if (!signupIntentToken?.trim()) return base;
  const url = new URL(base, typeof window !== "undefined" ? window.location.origin : guideUrl("/"));
  url.searchParams.set("intent", signupIntentToken.trim());
  return `${url.pathname}${url.search}${url.hash}`;
};

const QualificationUploader = (props: any) => (
  <ApplicationQualificationUploader {...props} deferUpload />
);

const FOUNDER_NOTE_PARAGRAPH_IDS = [
  "becomeGuide.founderNote.paragraph1",
  "becomeGuide.founderNote.paragraph2",
  "becomeGuide.founderNote.paragraph3",
  "becomeGuide.founderNote.paragraph4",
  "becomeGuide.founderNote.paragraph5",
] as const;

const FounderNote = ({ intl }: { intl: IntlShape }) => (
  <section aria-labelledby="become-guide-founder-note-title" className="mb-6">
    <div className="rounded-lg border border-yellow-200 bg-white/90 p-6 shadow-sm dark:border-yellow-500/30 dark:bg-gray-900/70 sm:p-7">
      <p className="mb-2 text-xs font-semibold uppercase text-yellow-700 dark:text-yellow-300">
        {intl.formatMessage({ id: "becomeGuide.founderNote.eyebrow" })}
      </p>
      <h2
        id="become-guide-founder-note-title"
        className="text-2xl font-semibold text-gray-950 dark:text-white"
      >
        {intl.formatMessage({ id: "becomeGuide.founderNote.title" })}
      </h2>
      <div className="mt-4 max-w-3xl space-y-4 text-base leading-7 text-gray-700 dark:text-gray-200">
        {FOUNDER_NOTE_PARAGRAPH_IDS.map((id) => (
          <p key={id}>{intl.formatMessage({ id })}</p>
        ))}
      </div>
    </div>
  </section>
);

const BecomeGuidePage = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const intl = useIntl();
  const [, setLocation] = useLocation();
  const initialStep = useMemo(readInitialStep, []);
  const destinationsQuery = useQuery<GuideFormDestination[]>({
    queryKey: DESTINATIONS_QUERY_KEY,
    queryFn: async () => {
      const data = await apiRequest("GET", "/api/v2/destinations?countryCode=JP");
      if (!Array.isArray(data)) {
        throw new Error("Destinations response was not an array");
      }
      return data as GuideFormDestination[];
    },
    initialData: readCachedDestinations,
    staleTime: DESTINATIONS_CACHE_TTL_MS,
    gcTime: 30 * 60 * 1000,
  });
  const destinations = destinationsQuery.data ?? [];

  useEffect(() => {
    if (destinations.length > 0) {
      cacheDestinations(destinations);
    }
  }, [destinations]);

  useEffect(() => {
    if (!destinationsQuery.isError) return;

    console.error("Failed to load guide destinations:", destinationsQuery.error);
    toast({
      title: intl.formatMessage({
        id: "becomeGuide.toast.destinationsLoadFailedTitle",
        defaultMessage: "Service areas could not be loaded",
      }),
      description: intl.formatMessage({
        id: "becomeGuide.toast.destinationsLoadFailedDesc",
        defaultMessage:
          "You can still type your service area and submit it for review.",
      }),
    });
  }, [destinationsQuery.error, destinationsQuery.isError, intl, toast]);

  const archiveApplicationPdf = useCallback(async (applicationId: string | number) => {
    const printRoot = document.getElementById("print-root");
    const token = localStorage.getItem("yaotu_token");
    if (!printRoot || !token) return;

    const pdfWorker = html2pdf()
      .set({
        margin: [12, 12, 12, 12],
        filename: `guide-application-${applicationId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .from(printRoot);

    const pdfBlob = await pdfWorker.outputPdf("blob");
    if (!pdfBlob.size || pdfBlob.size > 10 * 1024 * 1024) return;

    const pdfArrayBuffer = await pdfBlob.arrayBuffer();
    const response = await fetch(
      resolveApiUrl(`/api/v2/guide-applications/${applicationId}/archive-pdf`),
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/pdf",
        },
        body: pdfArrayBuffer,
      }
    );

    if (!response.ok) {
      console.error("Guide application PDF archive failed", await response.text());
    }
  }, []);

  const config = useMemo<GuideFormConfig>(
    () => ({
      resolveApiUrl,
      apiEndpoints: {
        loadDraft: "/api/v2/guide-applications/draft",
        saveDraft: "/api/v2/guide-applications/draft",
        handoffDraft: "/api/v2/guide-applications/draft/handoff",
        createSignupIntent: "/api/v2/guide-signup-intents",
        submitApplication: "/api/v2/guide-applications",
        updateApplication: (applicationId) => `/api/v2/guide-applications/${applicationId}`,
        qualificationUpload: "/api/v2/guide-applications/qualification-upload",
      },
      auth: {
        getToken: () => localStorage.getItem("yaotu_token"),
        getUserId: () => {
          const storedUserId = localStorage.getItem("yaotu_user_id");
          return user?.id ?? (storedUserId ? Number(storedUserId) : null);
        },
        getUser: () =>
          user
            ? (user as unknown as {
                emailVerified?: boolean;
                emailverified?: boolean;
                [key: string]: unknown;
              })
            : null,
        isEmailVerified: () =>
          Boolean(
            (user as unknown as { emailVerified?: boolean; emailverified?: boolean } | null)
              ?.emailVerified ||
              (user as unknown as { emailVerified?: boolean; emailverified?: boolean } | null)
                ?.emailverified
          ),
      },
      callbacks: {
        onAuthRequired: (redirectTo, context) => {
          setLocation(
            pathWithRedirectAndIntent("/signup", redirectTo, context?.signupIntentToken)
          );
        },
        onVerificationRequired: (redirectTo) => {
          rememberPostEmailVerificationRedirect(redirectTo);
          window.location.assign(getCanonicalVerifyEmailPath(guideLoginContinuation(redirectTo)));
        },
        onHandoffConflict: () => {
          toast({
            title: intl.formatMessage({
              id: "becomeGuide.toast.draftConflictTitle",
              defaultMessage: "Saved application found",
            }),
            description: intl.formatMessage({
              id: "becomeGuide.toast.draftConflictDesc",
              defaultMessage:
                "Continue the saved application on your account. Your browser draft was kept locally.",
            }),
            variant: "destructive",
          });
        },
        onError: (error) => {
          if (isTokenExpiredError(error)) {
            console.info("Guide application session expired; continuing with anonymous draft.");
            logout();
            toast({
              title: intl.formatMessage({
                id: "becomeGuide.toast.sessionExpiredTitle",
                defaultMessage: "Session expired",
              }),
              description: intl.formatMessage({
                id: "becomeGuide.toast.sessionExpiredDesc",
                defaultMessage:
                  "We signed you out. You can keep editing this draft and sign in again when prompted.",
              }),
            });
            return;
          }

          console.error("Guide application error:", error);
          toast({
            title: intl.formatMessage({
              id: "becomeGuide.toast.genericErrorTitle",
              defaultMessage: "Something went wrong",
            }),
            description: intl.formatMessage({
              id: "becomeGuide.toast.genericErrorDesc",
              defaultMessage: "Please try again. Your draft is preserved.",
            }),
            variant: "destructive",
          });
        },
        onSuccess: (payload) => {
          const applicationId = extractApplicationId(payload);
          toast({
            title: intl.formatMessage({ id: "becomeGuide.toast.submitSuccessTitle" }),
            description: intl.formatMessage({ id: "becomeGuide.toast.submitSuccessDesc" }),
            variant: "success",
          });
          if (applicationId) {
            void archiveApplicationPdf(applicationId);
          }
          setTimeout(() => setLocation("/view-application-status?submitted=true"), 1200);
        },
      },
      routes: {
        signup: "/signup",
        login: "/login",
        verifyEmail: getCanonicalVerifyEmailPath(guideLoginContinuation(RESUME_PATH)),
        resumePath: RESUME_PATH,
      },
    }),
    [archiveApplicationPdf, intl, logout, setLocation, toast, user]
  );

  const uiComponents = useMemo<UIComponents>(
    () => ({
      Form,
      FormField,
      FormItem,
      FormLabel,
      FormControl,
      FormMessage,
      Input,
      Textarea,
      Checkbox,
      RadioGroup,
      RadioGroupItem,
      Button,
      Card,
      CardContent,
      CardHeader,
      CardTitle,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
      Progress,
      Slider,
      Badge,
      Separator,
      YearMonthPicker,
      Tooltip,
      TooltipContent,
      TooltipTrigger,
      TooltipProvider,
      QualificationUploader,
      Info,
      ChevronLeft,
      ChevronRight,
      Save,
    }),
    []
  );

  const targetGroups = useMemo(
    () => [
      { value: "individual" },
      { value: "couple" },
      { value: "family" },
      { value: "group" },
      { value: "child" },
      { value: "elderly" },
      { value: "business" },
    ],
    []
  );

  const loadServiceCategories = useCallback(
    () => apiRequest("GET", "/api/v2/service-categories/with-subcategories"),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  {intl.formatMessage({ id: "becomeGuide.title" })}
                </h1>
                <p className="mt-2 text-yellow-100">
                  {intl.formatMessage({ id: "becomeGuide.subtitle" })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLocation("/")}
                className="text-2xl text-white/80 hover:text-white"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl p-6">
          <FounderNote intl={intl} />
          <TooltipProvider>
            <GuideForm
              config={config}
              ui={uiComponents}
              destinations={destinations}
              destinationsLoading={destinationsQuery.isLoading && destinations.length === 0}
              destinationsLoadError={destinationsQuery.isError && destinations.length === 0}
              allowCustomDestination
              targetGroups={targetGroups}
              onLoadServiceCategories={loadServiceCategories}
              customTitle={intl.formatMessage({ id: "becomeGuide.title" })}
              customDescription={intl.formatMessage({ id: "becomeGuide.subtitle" })}
              showProgressBar
              initialStep={initialStep}
            />
          </TooltipProvider>
        </div>

        <div id="print-root" className="hidden print:block" />
      </motion.div>
    </div>
  );
};

export default BecomeGuidePage;

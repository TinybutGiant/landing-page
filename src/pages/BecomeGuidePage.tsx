import { useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import html2pdf from "html2pdf.js";
import { ChevronLeft, ChevronRight, Info, Save } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useIntl } from "react-intl";
import { useLocation } from "wouter";
import {
  DEFAULT_RESUME_PATH,
  FounderNoteMail,
  GUIDE_APPLICATION_IDENTITY_INTENT_STORAGE_KEY,
  GuideForm,
  type GuideFormConfig,
  type GuideFormDestination,
  type UIComponents,
} from "@replit/guide-form";

import ApplicationQualificationUploader from "@/components/ApplicationQualificationUploader";
import YaotuAppChrome from "@/components/YaotuAppChrome";
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
import { resolveApplicantContinuation } from "@/lib/applicantContinuation";
import { getCanonicalVerifyEmailPath } from "@/lib/yaotuAuthRuntime";

const RESUME_PATH = DEFAULT_RESUME_PATH;
const DESTINATIONS_QUERY_KEY = ["/api/v2/destinations", "JP"] as const;
const DESTINATIONS_CACHE_KEY = "yaotu_landing_destinations_JP_v1";
const DESTINATIONS_CACHE_TTL_MS = 10 * 60 * 1000;

type CachedDestinations = {
  cachedAt: number;
  destinations: GuideFormDestination[];
};

type GuideApplicationState = {
  hasApplication: boolean;
  applicationStatus?: string;
  applicationId?: string | number;
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

const readApplicationSource = (): string | undefined => {
  if (typeof window === "undefined") return undefined;
  const source = new URLSearchParams(window.location.search).get("from")?.trim();
  return source && /^[a-z0-9_-]{1,64}$/i.test(source) ? source : undefined;
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

const QualificationUploader = (props: any) => (
  <ApplicationQualificationUploader {...props} deferUpload />
);

const BecomeGuidePage = () => {
  const { user, loading, logout } = useAuth();
  const { toast } = useToast();
  const intl = useIntl();
  const [, setLocation] = useLocation();
  const initialStep = useMemo(readInitialStep, []);
  const applicationSource = useMemo(readApplicationSource, []);
  const applicationStateQuery = useQuery<GuideApplicationState>({
    queryKey: ["/api/v2/guide-applications/status", "become-guide-entry", user?.id],
    queryFn: () => apiRequest("GET", "/api/v2/guide-applications/status"),
    enabled: !loading && Boolean(user),
    staleTime: 0,
    retry: 1,
  });
  const continuationIntent = resolveApplicantContinuation({
    hasApplication: applicationStateQuery.data?.hasApplication ?? false,
    applicationStatus: applicationStateQuery.data?.applicationStatus,
  });

  useEffect(() => {
    if (
      loading ||
      !user ||
      !applicationStateQuery.isSuccess ||
      applicationStateQuery.isFetching
    ) {
      return;
    }

    if (continuationIntent === "view_status") {
      setLocation("/view-application-status");
    }
  }, [
    applicationStateQuery.isSuccess,
    applicationStateQuery.isFetching,
    continuationIntent,
    loading,
    setLocation,
    user,
  ]);
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
      // Source attribution only; @replit/guide-form owns the Guide Application state machine.
      applicationSource,
      applicationContinuation: continuationIntent,
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
        isLoading: () => loading,
      },
      callbacks: {
        onVerificationRequired: (redirectTo) => {
          rememberPostEmailVerificationRedirect(redirectTo);
          window.location.assign(getCanonicalVerifyEmailPath(guideLoginContinuation(redirectTo)));
        },
        onHandoffConflict: (conflict) => {
          if (
            conflict.reason === "submitted_application" ||
            conflict.reason === "guide_profile_exists"
          ) {
            return;
          }
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
        onHandoffSuccess: () => {
          sessionStorage.removeItem(GUIDE_APPLICATION_IDENTITY_INTENT_STORAGE_KEY);
        },
        onNavigateToStatus: () => setLocation("/view-application-status"),
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
            title: intl.formatMessage({
              id: "becomeGuide.toast.submitSuccessTitle",
              defaultMessage: "Application submitted",
            }),
            description: intl.formatMessage({
              id: "becomeGuide.toast.submitSuccessDesc",
              defaultMessage:
                "Your application was submitted. We will review it within 1–3 business days.",
            }),
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
    [
      applicationSource,
      archiveApplicationPdf,
      continuationIntent,
      intl,
      loading,
      logout,
      setLocation,
      toast,
      user,
    ]
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

  const isResolvingCanonicalState =
    loading ||
    (Boolean(user) && (applicationStateQuery.isPending || applicationStateQuery.isFetching));
  const isLeavingGuideForm =
    Boolean(user) &&
    applicationStateQuery.isSuccess &&
    continuationIntent === "view_status";

  if (isResolvingCanonicalState || isLeavingGuideForm) return null;

  if (user && applicationStateQuery.isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-orange-50 p-6">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>
              {intl.formatMessage({
                id: "becomeGuide.applicationStateUnavailableTitle",
                defaultMessage: "Application status is temporarily unavailable",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              {intl.formatMessage({
                id: "becomeGuide.applicationStateUnavailableDesc",
                defaultMessage:
                  "We could not safely determine whether this application is editable. Try again or view your application status.",
              })}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={() => void applicationStateQuery.refetch()}>
                {intl.formatMessage({
                  id: "becomeGuide.applicationStateRetry",
                  defaultMessage: "Try again",
                })}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/view-application-status")}
              >
                {intl.formatMessage({
                  id: "becomeGuide.applicationStateViewStatus",
                  defaultMessage: "View application status",
                })}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="become-guide-page min-h-screen">
      <div className="become-guide-orb" aria-hidden />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        className="relative min-h-screen"
      >
        <YaotuAppChrome title={intl.formatMessage({ id: "becomeGuide.title" })} />

        <FounderNoteMail />

        <main className="guide-form-stage mx-auto w-full max-w-5xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
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
        </main>

        <div id="print-root" className="hidden print:block" />
      </motion.div>
    </div>
  );
};

export default BecomeGuidePage;

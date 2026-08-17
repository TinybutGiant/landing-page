import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import html2pdf from "html2pdf.js";
import { ChevronLeft, ChevronRight, Info, Save } from "lucide-react";
import { useIntl } from "react-intl";
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

const QualificationUploader = (props: any) => (
  <ApplicationQualificationUploader {...props} deferUpload />
);

const BecomeGuidePage = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const intl = useIntl();
  const [, setLocation] = useLocation();
  const initialStep = useMemo(readInitialStep, []);
  const [destinations, setDestinations] = useState<GuideFormDestination[]>([]);

  useEffect(() => {
    let cancelled = false;

    apiRequest("GET", "/api/v2/destinations?countryCode=JP")
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setDestinations(data as GuideFormDestination[]);
        }
      })
      .catch((error) => {
        console.error("Failed to load guide destinations:", error);
        if (!cancelled) {
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
        }
      });

    return () => {
      cancelled = true;
    };
  }, [intl, toast]);

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
        onAuthRequired: (redirectTo) => {
          setLocation(pathWithRedirect("/signup", redirectTo));
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
          <TooltipProvider>
            <GuideForm
              config={config}
              ui={uiComponents}
              destinations={destinations}
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

import React from "react";
import { useGuideForm } from "../hooks/useGuideForm";
import { GuideFormConfig, FormData, GuideFormDestination } from "../types/schema";
import { Step1BasicInfo } from "./Step1BasicInfo";
import { Step2SelfAssessment } from "./Step2SelfAssessment";
import { Step3PersonalizedQuestions } from "./Step3PersonalizedQuestions";
import { Step4ServicePreferences } from "./Step4ServicePreferences";
import { ApplicationPreview } from "./ApplicationPreview";
import { FormNavigation } from "./FormNavigation";
import { validateFormCompleteness } from "../utils/validation";
import { PAGE_TITLES, TOTAL_PAGES } from "../constants";
import { usePDFGeneration } from "../hooks/usePDFGeneration";
import { useIntl } from "react-intl";
import {
  isAuthenticated,
  isEmailVerified,
  navigateToVerification,
} from "../utils/guideFunnel";

// 统一的 UI 组件接口
export interface UIComponents {
  // 基础表单组件
  Form: any;
  FormField: any;
  FormItem: any;
  FormLabel: any;
  FormControl: any;
  FormMessage: any;
  Input: any;
  Select: any;
  SelectContent: any;
  SelectItem: any;
  SelectTrigger: any;
  SelectValue: any;
  Textarea: any;
  Checkbox: any;
  RadioGroup: any;
  RadioGroupItem: any;
  Button: any;
  Progress: any;
  Slider: any;
  Card: any;
  CardContent: any;
  CardHeader: any;
  CardTitle: any;
  Badge: any;
  Separator: any;
  YearMonthPicker: any;

  // 可选组件

  QualificationUploader?: any;
  Tooltip?: any;
  TooltipContent?: any;
  TooltipProvider?: any;
  TooltipTrigger?: any;
  Info?: any;
  ChevronLeft?: any;
  ChevronRight?: any;
  Save?: any;
}

interface GuideFormProps {
  config: GuideFormConfig;
  ui: UIComponents;
  destinations?: GuideFormDestination[];
  destinationsLoading?: boolean;
  destinationsLoadError?: boolean;
  allowCustomDestination?: boolean;
  targetGroups?: Array<{ value: string; label?: string }>;
  serviceCategories?: Array<{
    id: number;
    nameCn: string;
    nameEn: string;
    subcategories: Array<{
      id: number;
      categoryId: number;
      nameCn: string;
      nameEn: string;
      isCustom: boolean;
    }>;
  }>;
  onLoadServiceCategories?: () => Promise<Array<{
    id: number;
    nameCn: string;
    nameEn: string;
    subcategories: Array<{
      id: number;
      categoryId: number;
      nameCn: string;
      nameEn: string;
      isCustom: boolean;
    }>;
  }>>;
  customTitle?: string;
  customDescription?: string;
  showProgressBar?: boolean;
  onLoadLocalStorage?: () => any;
  onSaveLocalStorage?: (data: any) => void;
  onClearLocalStorage?: () => void;
  initialStep?: 'preview' | 'resume';
}

export const GuideForm: React.FC<GuideFormProps> = ({
  config,
  ui,
  destinations = [],
  destinationsLoading = false,
  destinationsLoadError = false,
  allowCustomDestination = true,
  targetGroups = [],
  serviceCategories,
  onLoadServiceCategories,
  customTitle = "Become a YaoTu Guide",
  customDescription = "Share your local expertise and connect with curious travelers.",
  showProgressBar = true,
  onLoadLocalStorage,
  onSaveLocalStorage,
  onClearLocalStorage,
  initialStep
}) => {
  const intl = useIntl();

  const {
    currentPage,
    setCurrentPage,
    showPreview,
    setShowPreview,
    confirmationChecked,
    setConfirmationChecked,
    missingFields,
    setMissingFields,
    form,
    isLoading,
    isSaving,
    isSubmitting,
    funnelState,
    draftConflict,
    acceptServerDraft,
    saveCurrentPageData,
    handleQualificationFilesChange,
    nextPage,
    prevPage,
    goToPreview,
    backToForm,
    continueToAuth,
    onSubmit,
    validateFormCompleteness: validateForm
  } = useGuideForm(config, onLoadLocalStorage, onSaveLocalStorage, onClearLocalStorage, initialStep);

  const { Form } = ui;
  const requiresAccountBeforeSubmit = !isAuthenticated(config) || !isEmailVerified(config);
  const isVerificationCheckpoint = isAuthenticated(config) && !isEmailVerified(config);
  const shouldShowAuthCheckpoint =
    (currentPage === 3 && requiresAccountBeforeSubmit) ||
    funnelState === "auth_required" ||
    funnelState === "verification_required";

  // PDF生成功能 - 必须在组件顶层调用
  const { downloadPDF, isProcessing } = usePDFGeneration({
    onSuccess: () => {
      console.log("PDF generated successfully!");
    },
    onError: (error: Error) => {
      console.error("PDF generation failed:", error);
    },
  });

  const handleDownloadPDF = () => {
    downloadPDF("print-root", {
      filename: `guide-application-${Date.now()}.pdf`,
    });
  };

  // 如果显示预览页面，渲染预览内容
  if (showPreview) {
    return (
      <ApplicationPreview
        formData={form.getValues()}
        missingFields={missingFields}
        confirmationChecked={confirmationChecked}
        setConfirmationChecked={setConfirmationChecked}
        onBackToForm={backToForm}
        onSubmit={onSubmit}
        isSubmitting={isLoading || isSubmitting}
        requiresAccountBeforeSubmit={requiresAccountBeforeSubmit}
        validateFormCompleteness={validateForm}
        setMissingFields={setMissingFields}
        destinations={destinations}
        ui={ui}
        intl={intl}
      />
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {customTitle}
          </h1>
          <p className="text-gray-600 mb-4">
            {customDescription}
          </p>
        </div>

        {/* 顶部进度条 - 与主项目保持一致 */}
        {showProgressBar && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>{intl.formatMessage({ id: 'becomeGuide.progress.pageInfo' }, { current: currentPage, total: TOTAL_PAGES })}</span>
              <span>
                {intl.formatMessage({ id: 'becomeGuide.progress.completion' }, { percentage: Math.round((currentPage / TOTAL_PAGES) * 100) })}
              </span>
            </div>
            <ui.Progress
              value={(currentPage / TOTAL_PAGES) * 100}
              className="h-2"
            />
          </div>
        )}

        <ui.Card className="rounded-2xl shadow-lg">
          <ui.CardHeader className="bg-yellow-400 rounded-t-2xl">
            <ui.CardTitle className="text-black">
              {intl.formatMessage({ id: PAGE_TITLES[currentPage as keyof typeof PAGE_TITLES] })}
            </ui.CardTitle>
            {currentPage === 2 && (
              <p className="text-sm text-gray-700 mt-2">
                {intl.formatMessage({ id: 'becomeGuide.step2.subtitle' })}
              </p>
            )}
            {currentPage === 3 && (
              <p className="text-sm text-gray-700 mt-2">
                {intl.formatMessage({ id: 'becomeGuide.step3.subtitle' })}
              </p>
            )}
            {currentPage === 4 && (
              <p className="text-sm text-gray-700 mt-2">
                {intl.formatMessage({ id: 'becomeGuide.step4.subtitle' })}
              </p>
            )}
          </ui.CardHeader>
          <ui.CardContent className="p-6">
            {draftConflict && (
              <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-semibold">Saved application found</p>
                <p className="mt-1 leading-relaxed">
                  We found an existing saved application for this account. To avoid overwriting
                  server data, the existing saved application remains authoritative. Your local
                  draft is preserved in this browser until you decide what to do.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ui.Button type="button" onClick={() => void acceptServerDraft()}>
                    Continue existing saved application
                  </ui.Button>
                </div>
              </div>
            )}
            {funnelState === "resume_after_auth" && !draftConflict && (
              <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                Restoring your saved application draft...
              </div>
            )}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(() => {})}
                className="space-y-6"
              >
                {/* 渲染当前步骤 */}
                {currentPage === 1 && (
                  <Step1BasicInfo
                    control={form.control as any}
                    handleQualificationFilesChange={handleQualificationFilesChange}
                    ui={ui}
                    destinations={destinations}
                    destinationsLoading={destinationsLoading}
                    destinationsLoadError={destinationsLoadError}
                    allowCustomDestination={allowCustomDestination}
                  />
                )}

                {currentPage === 2 && (
                  <Step2SelfAssessment
                    control={form.control as any}
                    ui={ui}
                    t={(key) => intl.formatMessage({ id: key })}
                  />
                )}

                {currentPage === 3 && (
                  <Step3PersonalizedQuestions
                    control={form.control as any}
                    ui={ui}
                    t={(key) => intl.formatMessage({ id: key })}
                  />
                )}

                {currentPage === 4 && (
                  <Step4ServicePreferences
                    control={form.control as any}
                    ui={ui}
                    serviceCategories={serviceCategories}
                    targetGroups={targetGroups}
                    onLoadServiceCategories={onLoadServiceCategories}
                  />
                )}

                {/* 导航组件 */}
                {shouldShowAuthCheckpoint && (
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-slate-900">
                    <p className="font-semibold">
                      {intl.formatMessage({
                        id: isVerificationCheckpoint
                          ? "becomeGuide.checkpoint.verifyTitle"
                          : "becomeGuide.checkpoint.authTitle",
                        defaultMessage: isVerificationCheckpoint
                          ? "Verify your email to continue"
                          : "Create or sign in to continue",
                      })}
                    </p>
                    <p className="mt-1 leading-relaxed text-slate-700">
                      {intl.formatMessage({
                        id: isVerificationCheckpoint
                          ? "becomeGuide.checkpoint.verifyDescription"
                          : "becomeGuide.checkpoint.authDescription",
                        defaultMessage: isVerificationCheckpoint
                          ? "Your answers and selected files are saved in this browser. Please verify your email before we upload files or save the application to your account."
                          : "Your answers and selected files are saved in this browser. Next, create or sign in to a YaoTu account so this application can be attached to you. Keep this browser open; after verification you will return here to continue.",
                      })}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <ui.Button
                        type="button"
                        onClick={() =>
                          isVerificationCheckpoint
                            ? navigateToVerification(config)
                            : void continueToAuth()
                        }
                      >
                        {intl.formatMessage({
                          id: isVerificationCheckpoint
                            ? "becomeGuide.checkpoint.verifyCta"
                            : "becomeGuide.checkpoint.authCta",
                          defaultMessage: isVerificationCheckpoint
                            ? "Continue to email verification"
                            : "Continue to account setup",
                        })}
                      </ui.Button>
                    </div>
                  </div>
                )}

                <FormNavigation
                  currentPage={currentPage}
                  onPrevPage={prevPage}
                  onNextPage={() => void nextPage()}
                  onGoToPreview={() => void goToPreview()}
                  onSaveDraft={saveCurrentPageData}
                  isSavingDraft={isSaving}
                  ui={ui}
                />
              </form>
            </Form>
          </ui.CardContent>
        </ui.Card>
      </div>
    </div>
  );
};

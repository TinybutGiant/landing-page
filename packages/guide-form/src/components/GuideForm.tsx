import React from "react";
import { useGuideForm } from "../hooks/useGuideForm";
import { GuideFormConfig, FormData } from "../types/schema";
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
  TooltipTrigger?: any;
  Info?: any;
  ChevronLeft?: any;
  ChevronRight?: any;
  Save?: any;
}

interface GuideFormProps {
  config: GuideFormConfig;
  ui: UIComponents;
  cities?: Array<{ value: string; label: string }>;
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
  initialStep?: 'preview';
}

export const GuideForm: React.FC<GuideFormProps> = ({
  config,
  ui,
  cities = [],
  targetGroups = [],
  serviceCategories,
  onLoadServiceCategories,
  customTitle = "成为YaoTu地陪",
  customDescription = "分享您的当地专业知识，通过引导旅行者了解您的城市来赚钱。",
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
    saveCurrentPageData,
    handleQualificationFilesChange,
    nextPage,
    prevPage,
    goToPreview,
    backToForm,
    onSubmit,
    validateFormCompleteness: validateForm
  } = useGuideForm(config, onLoadLocalStorage, onSaveLocalStorage, onClearLocalStorage, initialStep);

  const { Form } = ui;

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
        validateFormCompleteness={validateForm}
        setMissingFields={setMissingFields}
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(() => {})}
                className="space-y-6"
              >
                {/* 渲染当前步骤 */}
                {currentPage === 1 && (
                  <Step1BasicInfo
                    control={form.control}
                    handleQualificationFilesChange={handleQualificationFilesChange}
                    ui={ui}
                    cities={cities}
                  />
                )}

                {currentPage === 2 && (
                  <Step2SelfAssessment 
                    control={form.control} 
                    ui={ui}
                  />
                )}

                {currentPage === 3 && (
                  <Step3PersonalizedQuestions 
                    control={form.control} 
                    ui={ui}
                  />
                )}

                {currentPage === 4 && (
                  <Step4ServicePreferences 
                    control={form.control} 
                    ui={ui}
                    serviceCategories={serviceCategories}
                    targetGroups={targetGroups}
                    onLoadServiceCategories={onLoadServiceCategories}
                  />
                )}

                {/* 导航组件 */}
                <FormNavigation
                  currentPage={currentPage}
                  onPrevPage={prevPage}
                  onNextPage={nextPage}
                  onGoToPreview={goToPreview}
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

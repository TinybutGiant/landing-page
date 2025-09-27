import React from "react";
import { useGuideForm } from "../hooks/useGuideForm";
import { GuideFormConfig, FormData } from "../types/schema";
import { Step1BasicInfo } from "./Step1BasicInfo";
import { Step2SelfAssessment } from "./Step2SelfAssessment";
import { Step3PersonalizedQuestions } from "./Step3PersonalizedQuestions";
import { Step4ServicePreferences } from "./Step4ServicePreferences";
import { FormNavigation } from "./FormNavigation";
import { validateFormCompleteness } from "../utils/validation";
import { PAGE_TITLES, TOTAL_PAGES } from "../constants";
import { usePDFGeneration } from "../hooks/usePDFGeneration";

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
  targetGroups?: Array<{ value: string; label: string }>;
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
  onClearLocalStorage
}) => {
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
  } = useGuideForm(config, onLoadLocalStorage, onSaveLocalStorage, onClearLocalStorage);

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
    downloadPDF("preview-content", {
      filename: `guide-application-${Date.now()}.pdf`,
    });
  };

  // 如果显示预览页面，渲染预览内容
  if (showPreview) {

    return (
      <div className="min-h-screen bg-yellow-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">申请预览</h1>
            <p className="text-gray-600 mb-4">
              请仔细检查您的申请信息，确认无误后提交。
            </p>
            <div className="mb-4">
              <ui.Button
                onClick={handleDownloadPDF}
                disabled={isProcessing}
                className="bg-blue-500 hover:bg-blue-600 text-black mr-2"
              >
                {isProcessing ? "生成中..." : "下载PDF"}
              </ui.Button>
            </div>
          </div>

          <ui.Card className="shadow-lg" id="preview-content">
            <ui.CardContent className="p-6 space-y-8">
              {/* 基本信息 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                  基本信息
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      姓名
                    </label>
                    <p className="text-gray-900">{form.getValues().name || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      年龄
                    </label>
                    <p className="text-gray-900">{form.getValues().age || "-"}岁</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      性别
                    </label>
                    <p className="text-gray-900">
                      {form.getValues().sex === "Male"
                        ? "男"
                        : form.getValues().sex === "Female"
                          ? "女"
                          : "不愿透露"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      MBTI人格类型
                    </label>
                    <p className="text-gray-900">{form.getValues().mbti || "-"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">
                      社交媒体链接
                    </label>
                    <p className="text-gray-900">
                      {form.getValues().socialProfile || "未填写"}
                    </p>
                  </div>
                </div>
              </div>

              {/* 服务信息 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                  服务信息
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      服务城市
                    </label>
                    <p className="text-gray-900">
                      {form.getValues().serviceCity || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      在日本生活的起始时间
                    </label>
                    <p className="text-gray-900">
                      {form.getValues().residenceStartDate
                        ? new Date(
                            form.getValues().residenceStartDate as string,
                          ).toLocaleDateString("zh-CN", {
                            year: "numeric",
                            month: "long",
                          })
                        : "-"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">
                      住址/常驻区域
                    </label>
                    <p className="text-gray-900">
                      {form.getValues().residenceInfo || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      当前职业
                    </label>
                    <p className="text-gray-900">
                      {form.getValues().occupation || "-"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">
                      自我介绍
                    </label>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {form.getValues().bio || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* 自我认知评估 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                  自我认知评估
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      道德感评分
                    </label>
                    <p className="text-gray-900">{form.getValues().ethicsScore}/10</p>
                    {form.getValues().ethicsDescription && (
                      <p className="text-sm text-gray-600 mt-1">
                        {form.getValues().ethicsDescription}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      边界感评分
                    </label>
                    <p className="text-gray-900">{form.getValues().boundaryScore}/10</p>
                    {form.getValues().boundaryDescription && (
                      <p className="text-sm text-gray-600 mt-1">
                        {form.getValues().boundaryDescription}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      应变力评分
                    </label>
                    <p className="text-gray-900">
                      {form.getValues().supportiveScore}/10
                    </p>
                    {form.getValues().supportiveDescription && (
                      <p className="text-sm text-gray-600 mt-1">
                        {form.getValues().supportiveDescription}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 个性化提问 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                  个性化提问
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      希望的客人互动方式
                    </label>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {form.getValues().q1Interaction || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      最喜欢的日本城市角落
                    </label>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {form.getValues().q2FavSpot || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      边界情况处理方式
                    </label>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {form.getValues().q3BoundaryResponse || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      情绪处理方式
                    </label>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {form.getValues().q4EmotionalHandling || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      代表性的物品或符号
                    </label>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {form.getValues().q5SelfSymbol || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* 服务类型与偏好 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                  服务类型与偏好
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      服务对象
                    </label>
                    <p className="text-gray-900">
                      {form.getValues().targetGroup && form.getValues().targetGroup.length > 0
                        ? form.getValues().targetGroup.map((group) => {
                            const labels: Record<string, string> = {
                              individual: "个人旅客",
                              couple: "情侣/夫妇",
                              family: "家庭",
                              group: "团体",
                              child: "亲子",
                              elderly: "老年人",
                              business: "商务客户"
                            };
                            return labels[group] || group;
                          }).join("、")
                        : "-"}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        服务人数范围
                      </label>
                      <p className="text-gray-900">
                          {form.getValues().minPeople && form.getValues().maxPeople
                            ? `${form.getValues().minPeople} - ${form.getValues().maxPeople} 人`
                            : "-"}
                        </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        服务时长范围
                      </label>
                      <p className="text-gray-900">
                        {form.getValues().minDuration && form.getValues().maxDuration
                          ? `${form.getValues().minDuration} - ${form.getValues().maxDuration} 小时`
                          : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        基础时薪
                      </label>
                      <p className="text-gray-900">
                        {form.getValues().basicPricePerHourCents !== undefined
                          ? `${((form.getValues().basicPricePerHourCents || 0) / 100).toFixed(2)} ${form.getValues().currency || "JPY"}/小时`
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        额外人员费用
                      </label>
                      <p className="text-gray-900">
                        {form.getValues().additionalPricePerPersonCents !== undefined
                          ? `${((form.getValues().additionalPricePerPersonCents || 0) / 100).toFixed(2)} ${form.getValues().currency || "JPY"}/人/小时`
                          : "-"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      提供的服务项目
                    </label>
                    <p className="text-gray-900">
                      {form.getValues().serviceSelections && form.getValues().serviceSelections.length > 0
                        ? `已选择 ${form.getValues().serviceSelections.length} 个服务项目`
                        : "未选择"}
                    </p>
                  </div>
                </div>
              </div>

              {/* 缺失字段提示 */}
              {missingFields.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        <strong>以下信息尚未完善：</strong>
                        <br />
                        {missingFields.join("、")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 确认声明 */}
              <div className="bg-gray-50 p-6 rounded-lg border-t-4 border-yellow-500">
                <div className="flex items-start space-x-3">
                  <ui.Checkbox
                    id="confirmation"
                    checked={confirmationChecked}
                    onCheckedChange={(checked: boolean) =>
                      setConfirmationChecked(checked === true)
                    }
                    className="mt-1"
                  />
                  <label
                    htmlFor="confirmation"
                    className="text-sm text-gray-700 leading-relaxed"
                  >
                    我确认以上所填写的所有信息均属实且准确无误。我理解虚假信息可能导致申请被拒绝或账户被暂停。我同意YaoTu平台的服务条款和隐私政策，并承诺作为地陪时将遵守平台规则，提供优质的服务体验。
                  </label>
                </div>
              </div>

              {/* 底部按钮 */}
              <div className="flex justify-between items-center pt-6 border-t">
                <ui.Button type="button" variant="outline" onClick={backToForm}>
                  <ui.ChevronLeft className="h-4 w-4 mr-1" />
                  返回编辑
                </ui.Button>

                <ui.Button
                  type="button"
                  onClick={onSubmit}
                  disabled={isLoading || isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading || isSubmitting ? "提交中..." : "确认提交申请"}
                </ui.Button>
              </div>
            </ui.CardContent>
          </ui.Card>
        </div>
      </div>
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
              <span>第{currentPage}页，共{TOTAL_PAGES}页</span>
              <span>
                {Math.round((currentPage / TOTAL_PAGES) * 100)}% 完成
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
              {PAGE_TITLES[currentPage as keyof typeof PAGE_TITLES]}
            </ui.CardTitle>
            {currentPage === 2 && (
              <p className="text-sm text-gray-700 mt-2">
                用于匹配"天选地陪"标签，请诚实评价自己
              </p>
            )}
            {currentPage === 3 && (
              <p className="text-sm text-gray-700 mt-2">
                打破模板化申请，评估适配度
              </p>
            )}
            {currentPage === 4 && (
              <p className="text-sm text-gray-700 mt-2">
                设置您的服务范围、定价和偏好
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

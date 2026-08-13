import { ChevronLeft } from "lucide-react";
import { FormData } from "../types/schema";
import { formatCurrency } from "../utils/currencyUtils";

// 基础 UI 组件接口
export interface UIComponents {
  Card: any;
  CardContent: any;
  Button: any;
  Checkbox: any;
}

interface ApplicationPreviewProps {
  formData: FormData;
  missingFields: string[];
  confirmationChecked: boolean;
  setConfirmationChecked: (checked: boolean) => void;
  onBackToForm: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  requiresAccountBeforeSubmit?: boolean;
  validateFormCompleteness: (formData: FormData) => string[];
  setMissingFields: (fields: string[]) => void;
  ui: UIComponents;
  intl?: any;
}

const MISSING_FIELD_LABELS: Record<string, string> = {
  "becomeGuide.step2.q1Question": "第 2 步 Q1 回答",
  "becomeGuide.step2.q1SliderTitle": "第 2 步 Q1 评分",
  "becomeGuide.step2.q2Question": "第 2 步 Q2 回答",
  "becomeGuide.step2.q3Question": "第 2 步 Q3 回答",
  "becomeGuide.step2.q3SliderTitle": "第 2 步 Q3 评分",
  "becomeGuide.step2.q4Question": "第 2 步 Q4 回答",
  "becomeGuide.step2.q4SliderTitle": "第 2 步 Q4 评分",
  "becomeGuide.step3.q5Question": "第 3 步 Q5 回答",
  "becomeGuide.step3.q5SliderTitle": "第 3 步 Q5 评分",
  "becomeGuide.step3.q6Question": "第 3 步 Q6 回答",
  "becomeGuide.step3.q6SliderTitle": "第 3 步 Q6 评分",
  "becomeGuide.step3.q7Question": "第 3 步 Q7 回答",
  "becomeGuide.step3.q7SliderTitle": "第 3 步 Q7 评分",
  "becomeGuide.step3.q8Question": "第 3 步 Q8 优势选择",
  "becomeGuide.step3.q8SliderTitle": "第 3 步 Q8 评分",
  "becomeGuide.step3.q8ExampleQuestion": "第 3 步 Q8 示例说明",
  "becomeGuide.step3.q9Question": "第 3 步 Q9 描述",
};

export const ApplicationPreview = ({
  formData,
  missingFields,
  confirmationChecked,
  setConfirmationChecked,
  onBackToForm,
  onSubmit,
  isSubmitting,
  requiresAccountBeforeSubmit = false,
  validateFormCompleteness,
  setMissingFields,
  ui,
  intl
}: ApplicationPreviewProps) => {
  const { Card, CardContent, Button, Checkbox } = ui;
  const translate = (key: string) => intl?.formatMessage({ id: key }) ?? key;
  const formatMissingField = (field: string) =>
    MISSING_FIELD_LABELS[field] ?? translate(field);
  const optionLabels = (step: 2 | 3, question: string, values?: string[]) =>
    values?.length
      ? values.map((value) => translate(`becomeGuide.step${step}.${question}Options.${value}`)).join(", ")
      : "-";

  const handleSubmit = () => {
    if (!confirmationChecked) {
      return;
    }

    const missing = validateFormCompleteness(formData);

    if (missing.length > 0) {
      setMissingFields(missing);
      return;
    }

    setMissingFields([]);
    onSubmit();
  };

  return (
    <div className="min-h-screen bg-yellow-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            申请预览
          </h1>
          <p className="text-gray-600 mb-4">
            请仔细检查您的申请信息，确认无误后提交
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent id="print-root" className="p-6 space-y-8">
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
                  <p className="text-gray-900">{formData.name || "未填写"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    年龄
                  </label>
                  <p className="text-gray-900">{formData.age ? `${formData.age} 岁` : "未填写"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    性别
                  </label>
                  <p className="text-gray-900">
                    {formData.sex === "Male"
                      ? "男"
                      : formData.sex === "Female"
                        ? "女"
                        : "不愿透露"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    MBTI
                  </label>
                  <p className="text-gray-900">{formData.mbti || "未填写"}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">
                    社交媒体简介
                  </label>
                  <p className="text-gray-900">
                    {formData.socialProfile || "未填写"}
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
                    {formData.serviceCity || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    居住开始日期
                  </label>
                  <p className="text-gray-900">
                    {formData.residenceStartDate
                      ? (() => {
                          const date = new Date(formData.residenceStartDate);
                          return `${date.getFullYear()}年${date.getMonth() + 1}月`;
                        })()
                      : "未填写"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">
                    居住信息
                  </label>
                  <p className="text-gray-900">
                    {formData.residenceInfo || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    邮政编码
                  </label>
                  <p className="text-gray-900">
                    {formData.residenceZipcode || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    职业
                  </label>
                  <p className="text-gray-900">
                    {formData.occupation || "-"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">
                    个人简介
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {formData.bio || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* 资质与经验 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                资质与经验
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    语言能力
                  </label>
                  <p className="text-gray-900">
                    {formData.languages &&
                    formData.languages.length > 0
                      ? formData.languages.join("、")
                      : "未选择"}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      导游经验时长
                    </label>
                    <p className="text-gray-900">
                      {formData.experienceDuration || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      导游次数
                    </label>
                    <p className="text-gray-900">
                      {formData.experienceSession || "-"}
                    </p>
                  </div>
                </div>

                {/* 资质证明 */}
                {formData.qualifications?.certifications &&
                  Object.keys(formData.qualifications.certifications).length >
                    0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        资质证明文件
                      </label>
                      <div className="space-y-2 mt-1">
                        {Object.entries(
                          formData.qualifications.certifications,
                        )
                        .filter(([, certData]: [string, any]) => certData.visible !== false)
                        .map(([certName, certData]: [string, any]) => (
                          <div
                            key={certName}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded"
                          >
                            <span className="text-sm font-medium text-gray-700">
                              {certName}
                            </span>
                            {certData.description && certData.proof ? (
                              <a
                                href={certData.proof}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm underline"
                              >
                                {certData.description}
                              </a>
                            ) : certData.description ? (
                              <span className="text-sm text-gray-600">
                                {certData.description}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">
                                未上传文件
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Page 2 evaluation questions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                {translate("becomeGuide.step2.title")}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {translate("becomeGuide.step2.q1Question")}
                  </label>
                  <p className="text-gray-900">
                    {optionLabels(2, "q1", formData.assessmentQ1)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {translate("becomeGuide.step2.q1SliderTitle")}:{" "}
                    {formData.assessmentQ1Slider ?? "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {translate("becomeGuide.step2.q2Question")}
                  </label>
                  <p className="text-gray-900">
                    {formData.assessmentQ2
                      ? translate(`becomeGuide.step2.q2Options.${formData.assessmentQ2}`)
                      : "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {translate("becomeGuide.step2.q3Question")}
                  </label>
                  <p className="text-gray-900">
                    {formData.assessmentQ3
                      ? translate(`becomeGuide.step2.q3Options.${formData.assessmentQ3}`)
                      : "-"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {translate("becomeGuide.step2.q3SliderTitle")}:{" "}
                    {formData.assessmentQ3Slider ?? "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {translate("becomeGuide.step2.q4Question")}
                  </label>
                  <p className="text-gray-900">
                    {optionLabels(2, "q4", formData.assessmentQ4)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {translate("becomeGuide.step2.q4SliderTitle")}:{" "}
                    {formData.assessmentQ4Slider ?? "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Page 3 evaluation questions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                {translate("becomeGuide.step3.title")}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {translate("becomeGuide.step3.q5Question")}
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {optionLabels(3, "q5", formData.personalizedQ5)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {translate("becomeGuide.step3.q5SliderTitle")}:{" "}
                    {formData.personalizedQ5Slider ?? "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {translate("becomeGuide.step3.q6Question")}
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {optionLabels(3, "q6", formData.personalizedQ6)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {translate("becomeGuide.step3.q6SliderTitle")}:{" "}
                    {formData.personalizedQ6Slider ?? "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {translate("becomeGuide.step3.q7Question")}
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {formData.personalizedQ7
                      ? translate(`becomeGuide.step3.q7Options.${formData.personalizedQ7}`)
                      : "-"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {translate("becomeGuide.step3.q7SliderTitle")}:{" "}
                    {formData.personalizedQ7Slider ?? "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {translate("becomeGuide.step3.q8Question")}
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {optionLabels(3, "q8", formData.personalizedQ8Strengths)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.personalizedQ8Example || "-"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {translate("becomeGuide.step3.q8SliderTitle")}:{" "}
                    {formData.personalizedQ8Slider ?? "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {translate("becomeGuide.step3.q9Question")}
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {formData.personalizedQ9 || "-"}
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
                    {formData.targetGroup && formData.targetGroup.length > 0
                      ? formData.targetGroup.map((group) => {
                          const labels: Record<string, string> = {
                            individual: "个人",
                            couple: "情侣",
                            family: "家庭",
                            group: "团体",
                            child: "儿童",
                            elderly: "老人",
                            business: "商务"
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
                      {formData.minPeople && formData.maxPeople
                        ? `${formData.minPeople} - ${formData.maxPeople} 人`
                        : "未填写"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      服务时长范围
                    </label>
                    <p className="text-gray-900">
                      {formData.minDuration && formData.maxDuration
                        ? `${formData.minDuration} - ${formData.maxDuration} 小时`
                        : "未填写"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                  <label className="text-sm font-medium text-gray-500">
                    基础时薪
                  </label>
                    <p className="text-gray-900">
                      {formData.basicPricePerHour !== undefined
                        ? formatCurrency(formData.basicPricePerHour, formData.currency || 'USD') + "/小时"
                        : formData.basicPricePerHourCents !== undefined
                        ? formatCurrency(formData.basicPricePerHourCents / 100, formData.currency || 'USD') + "/小时"
                        : "未填写"}
                    </p>
                  </div>
                  <div>
                  <label className="text-sm font-medium text-gray-500">
                    额外人员费用
                  </label>
                    <p className="text-gray-900">
                      {formData.additionalPricePerPerson !== undefined
                        ? formatCurrency(formData.additionalPricePerPerson, formData.currency || 'USD') + "/人/小时"
                        : formData.additionalPricePerPersonCents !== undefined
                        ? formatCurrency(formData.additionalPricePerPersonCents / 100, formData.currency || 'USD') + "/人/小时"
                        : "未填写"}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    服务项目
                  </label>
                  <p className="text-gray-900">
                    {formData.serviceSelections && formData.serviceSelections.length > 0
                      ? `已选择 ${formData.serviceSelections.length} 个服务项目`
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
                      <strong>以下信息尚未完善</strong>
                      <br />
                      请返回编辑并补充：{missingFields.map(formatMissingField).join("、")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 确认声明 */}
            <div className="bg-gray-50 p-6 rounded-lg border-t-4 border-yellow-500">
              <div className="flex items-start space-x-3">
                <Checkbox
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
                  我确认以上填写的信息真实准确。我理解虚假信息可能导致申请被拒绝或账户被暂停。我同意YaoTu平台的服务条款和隐私政策，并承诺遵守平台规则，作为本地向导提供高质量的服务体验。
                </label>
              </div>
            </div>

            {/* 底部按钮 */}
            {requiresAccountBeforeSubmit && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-semibold">提交前需要先创建并验证账号</p>
                <p className="mt-1 leading-relaxed">
                  点击“确认提交申请”后，我们会先带你去创建账号并完成邮箱验证，用于之后查询申请进度。当前申请内容已保存在这个浏览器中；请不要关闭浏览器，验证后回到申请预览页继续提交。
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-6 border-t">
              <Button type="button" variant="outline" onClick={onBackToForm}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                返回编辑
              </Button>

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "提交中..." : "确认提交申请"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

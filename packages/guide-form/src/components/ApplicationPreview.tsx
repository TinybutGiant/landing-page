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
  validateFormCompleteness: (formData: FormData) => string[];
  setMissingFields: (fields: string[]) => void;
  ui: UIComponents;
  intl?: any;
}

export const ApplicationPreview = ({
  formData,
  missingFields,
  confirmationChecked,
  setConfirmationChecked,
  onBackToForm,
  onSubmit,
  isSubmitting,
  validateFormCompleteness,
  setMissingFields,
  ui,
  intl
}: ApplicationPreviewProps) => {
  const { Card, CardContent, Button, Checkbox } = ui;

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

            {/* 自我认知评估 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                自我认知评估
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    道德评分
                  </label>
                  <p className="text-gray-900">{formData.ethicsScore}/10</p>
                  {formData.ethicsDescription && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.ethicsDescription}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    边界意识评分
                  </label>
                  <p className="text-gray-900">{formData.boundaryScore}/10</p>
                  {formData.boundaryDescription && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.boundaryDescription}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    支持性评分
                  </label>
                  <p className="text-gray-900">
                    {formData.supportiveScore}/10
                  </p>
                  {formData.supportiveDescription && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.supportiveDescription}
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
                    互动风格
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {formData.q1Interaction || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    最喜欢的景点
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {formData.q2FavSpot || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    边界处理
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {formData.q3BoundaryResponse || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    情感处理
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {formData.q4EmotionalHandling || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    代表性符号
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {formData.q5SelfSymbol || "-"}
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
                        ? formatCurrency(formData.basicPricePerHour, formData.currency || 'JPY') + "/小时"
                        : formData.basicPricePerHourCents !== undefined
                        ? formatCurrency(formData.basicPricePerHourCents / 100, formData.currency || 'JPY') + "/小时"
                        : "未填写"}
                    </p>
                  </div>
                  <div>
                  <label className="text-sm font-medium text-gray-500">
                    额外人员费用
                  </label>
                    <p className="text-gray-900">
                      {formData.additionalPricePerPerson !== undefined
                        ? formatCurrency(formData.additionalPricePerPerson, formData.currency || 'JPY') + "/人/小时"
                        : formData.additionalPricePerPersonCents !== undefined
                        ? formatCurrency(formData.additionalPricePerPersonCents / 100, formData.currency || 'JPY') + "/人/小时"
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
                      <strong>缺失字段</strong>
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

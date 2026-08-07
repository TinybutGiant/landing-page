import { FormData } from "../types/schema";

export const validateEvaluationQuestions = (formData: Partial<FormData>): string[] => {
  const missingFields: string[] = [];

  if (!formData.assessmentQ1?.length) missingFields.push("becomeGuide.step2.q1Question");
  if (formData.assessmentQ1Slider == null)
    missingFields.push("becomeGuide.step2.q1SliderTitle");
  if (!formData.assessmentQ2) missingFields.push("becomeGuide.step2.q2Question");
  if (!formData.assessmentQ3) missingFields.push("becomeGuide.step2.q3Question");
  if (formData.assessmentQ3Slider == null)
    missingFields.push("becomeGuide.step2.q3SliderTitle");
  if (!formData.assessmentQ4?.length) missingFields.push("becomeGuide.step2.q4Question");
  if (formData.assessmentQ4Slider == null)
    missingFields.push("becomeGuide.step2.q4SliderTitle");
  if (!formData.personalizedQ5?.length) missingFields.push("becomeGuide.step3.q5Question");
  if (formData.personalizedQ5Slider == null)
    missingFields.push("becomeGuide.step3.q5SliderTitle");
  if (!formData.personalizedQ6?.length) missingFields.push("becomeGuide.step3.q6Question");
  if (formData.personalizedQ6Slider == null)
    missingFields.push("becomeGuide.step3.q6SliderTitle");
  if (!formData.personalizedQ7) missingFields.push("becomeGuide.step3.q7Question");
  if (formData.personalizedQ7Slider == null)
    missingFields.push("becomeGuide.step3.q7SliderTitle");
  if (!formData.personalizedQ8Strengths?.length)
    missingFields.push("becomeGuide.step3.q8Question");
  if (formData.personalizedQ8Slider == null)
    missingFields.push("becomeGuide.step3.q8SliderTitle");
  if (!formData.personalizedQ8Example?.trim())
    missingFields.push("becomeGuide.step3.q8ExampleQuestion");
  if (!formData.personalizedQ9?.trim()) missingFields.push("becomeGuide.step3.q9Question");

  return missingFields;
};

// 验证表单完整性
export const validateFormCompleteness = (formData: FormData): string[] => {
  const missingFields: string[] = [];

  // 基本信息验证
  if (!formData.name?.trim()) missingFields.push("姓名");
  if (!formData.age || formData.age < 18 || formData.age > 120)
    missingFields.push("年龄");
  if (!formData.sex) missingFields.push("性别");
  if (!formData.mbti) missingFields.push("MBTI人格类型");

  // 服务信息验证
  if (!formData.serviceCity?.trim()) missingFields.push("服务城市");
  if (!formData.residenceStartDate)
    missingFields.push("在日本生活的起始时间");
  if (!formData.residenceInfo?.trim()) missingFields.push("住址/常驻区域");
  if (!formData.residenceZipcode?.trim()) missingFields.push("邮政编码");
  if (!formData.occupation?.trim()) missingFields.push("当前职业");
  if (!formData.bio?.trim()) missingFields.push("自我介绍");

  // 资质与经验验证
  if (
    !formData.languages ||
    formData.languages.length === 0
  ) {
    missingFields.push("语言能力");
  }
  if (!formData.experienceDuration)
    missingFields.push("地陪时长");
  if (!formData.experienceSession)
    missingFields.push("地陪次数");

  missingFields.push(...validateEvaluationQuestions(formData));

  // 服务类型与偏好验证
  if (!formData.serviceSelections || formData.serviceSelections.length === 0)
    missingFields.push("服务项目选择");
  if (!formData.targetGroup || formData.targetGroup.length === 0)
    missingFields.push("服务对象");
  if (!formData.minPeople) missingFields.push("最少人数");
  if (!formData.maxPeople) missingFields.push("最多人数");
  if (!formData.minDuration) missingFields.push("最短时长");
  if (!formData.maxDuration) missingFields.push("最长时长");
  if (formData.basicPricePerHour === undefined || formData.basicPricePerHour === null || formData.basicPricePerHour < 0)
    missingFields.push("基础时薪");
  if (formData.additionalPricePerPerson === undefined || formData.additionalPricePerPerson === null || formData.additionalPricePerPerson < 0)
    missingFields.push("额外人员费用");
  if (!formData.currency) missingFields.push("货币类型");

  return missingFields;
};

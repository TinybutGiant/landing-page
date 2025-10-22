import { FormData } from "../types/schema";

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

  // 个性化提问验证
  if (!formData.q1Interaction?.trim())
    missingFields.push("希望的客人互动方式");
  if (!formData.q2FavSpot?.trim()) missingFields.push("最喜欢的日本城市角落");
  if (!formData.q3BoundaryResponse?.trim())
    missingFields.push("边界情况处理方式");
  if (!formData.q4EmotionalHandling?.trim())
    missingFields.push("情绪处理方式");
  if (!formData.q5SelfSymbol?.trim())
    missingFields.push("代表性的物品或符号");

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

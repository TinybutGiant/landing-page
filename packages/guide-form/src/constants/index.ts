// MBTI选项
export const MBTI_OPTIONS = [
  "ENFJ",
  "ENFP",
  "ENTJ",
  "ENTP",
  "ESFJ",
  "ESFP",
  "ESTJ",
  "ESTP",
  "INFJ",
  "INFP",
  "INTJ",
  "INTP",
  "ISFJ",
  "ISFP",
  "ISTJ",
  "ISTP",
];

// 性别选项 - 使用翻译键
export const SEX_OPTIONS = [
  { value: "Male", labelKey: "becomeGuide.step1.genderOptions.male" },
  { value: "Female", labelKey: "becomeGuide.step1.genderOptions.female" },
  { value: "prefer_not_to_say", labelKey: "becomeGuide.step1.genderOptions.preferNotToSay" },
];

// 页面配置 - 使用翻译键
export const PAGE_TITLES = {
  1: "becomeGuide.step1.step1PageTitle",
  2: "becomeGuide.step2.title",
  3: "becomeGuide.step3.title",
  4: "becomeGuide.step4.step4PageTitle"
} as const;

export const TOTAL_PAGES = 4;

// 评分相关常量
export const SCORE_MIN = 1;
export const SCORE_MAX = 9;

// 年龄限制
export const MIN_AGE = 18;
export const MAX_AGE = 120;

// 服务人数限制
export const MIN_PEOPLE = 1;
export const MAX_PEOPLE = 50;

// 时长限制（小时）
export const MIN_DURATION = 1;
export const MAX_DURATION = 48;

// 货币选项
export const CURRENCY_OPTIONS = [
  { value: "USD", label: "美元 (USD)" },
] as const;

// 评分说明 - 使用翻译键
export const SCORE_EXPLANATIONS = {
  ethics: {
    titleKey: "becomeGuide.scoreExplanations.ethics.title",
    descriptionKey: "becomeGuide.scoreExplanations.ethics.description",
    rangesKey: "becomeGuide.scoreExplanations.ethics.ranges",
  },
  boundary: {
    titleKey: "becomeGuide.scoreExplanations.boundary.title",
    descriptionKey: "becomeGuide.scoreExplanations.boundary.description",
    rangesKey: "becomeGuide.scoreExplanations.boundary.ranges",
  },
  supportive: {
    titleKey: "becomeGuide.scoreExplanations.supportive.title",
    descriptionKey: "becomeGuide.scoreExplanations.supportive.description",
    rangesKey: "becomeGuide.scoreExplanations.supportive.ranges",
  },
};

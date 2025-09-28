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
  { value: "preferNotToSay", labelKey: "becomeGuide.step1.genderOptions.preferNotToSay" },
];

// 页面配置 - 使用翻译键
export const PAGE_TITLES = {
  1: "becomeGuide.step1.step1PageTitle",
  2: "becomeGuide.step2.step2PageTitle", 
  3: "becomeGuide.step3.step3PageTitle",
  4: "becomeGuide.step4.step4PageTitle"
} as const;

export const TOTAL_PAGES = 4;

// 评分相关常量
export const SCORE_MIN = 0;
export const SCORE_MAX = 10;

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
  { value: "JPY", label: "日元 (JPY)" },
  { value: "USD", label: "美元 (USD)" },
  { value: "CNY", label: "人民币 (CNY)" },
] as const;

// 评分说明 - 使用翻译键
export const SCORE_EXPLANATIONS = {
  ethics: {
    title: "becomeGuide.step2.ethicsScore",
    description: "becomeGuide.step2.ethicsDescription",
    ranges: "becomeGuide.step2.ethicsRange0 | becomeGuide.step2.ethicsRange10",
  },
  boundary: {
    title: "becomeGuide.step2.boundaryScore",
    description: "becomeGuide.step2.boundaryDescription",
    ranges: "becomeGuide.step2.boundaryRange0 | becomeGuide.step2.boundaryRange10",
  },
  supportive: {
    title: "becomeGuide.step2.supportiveScore",
    description: "becomeGuide.step2.supportiveDescription",
    ranges: "becomeGuide.step2.supportiveRange0 | becomeGuide.step2.supportiveRange10",
  },
};

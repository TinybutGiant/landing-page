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

// 性别选项
export const SEX_OPTIONS = [
  { value: "Male", label: "男" },
  { value: "Female", label: "女" },
  { value: "Prefer not to say", label: "不愿透露" },
];

// 页面配置
export const PAGE_TITLES = {
  1: "基本信息 & 服务信息",
  2: "自我认知评估", 
  3: "个性化提问",
  4: "服务类型与偏好"
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

// 评分说明
export const SCORE_EXPLANATIONS = {
  ethics: {
    title: "道德感评估",
    description: "衡量责任感、正直性、安全边界。对应客户信任度。",
    ranges: "1-3: 包容 | 4-7: 平衡 | 8-10: 规矩",
  },
  boundary: {
    title: "边界感评估",
    description: "衡量私人空间与互动尺度的把握能力。对应服务舒适度。",
    ranges: "1-3: 外放 | 4-7: 社交型 | 8-10: 稳重",
  },
  supportive: {
    title: "应变力评估",
    description: "衡量氛围调节、临场反应能力。对应社交感染力。",
    ranges: "1-3: 木讷 | 4-7: 活跃伴聊 | 8-10: 主导型",
  },
};

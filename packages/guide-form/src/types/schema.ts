import { z } from "zod";
import { MBTI_OPTIONS, MIN_AGE, MAX_AGE, MIN_PEOPLE, MAX_PEOPLE, MIN_DURATION, MAX_DURATION, SCORE_MIN, SCORE_MAX } from "../constants";

// 表单验证Schema - 移除用户身份相关字段
export const formSchema = z.object({
  // 基本信息
  name: z.string().min(1, "请输入姓名"),
  age: z.number().min(MIN_AGE, `年龄必须至少${MIN_AGE}岁`).max(MAX_AGE, `年龄不能超过${MAX_AGE}岁`),
  sex: z.enum(["Male", "Female", "preferNotToSay"]),
  mbti: z
    .enum([
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
    ] as const)
    .optional(),
  socialProfile: z.string().optional(),
  
  // 自我评估
  ethicsScore: z.number().min(SCORE_MIN).max(SCORE_MAX),
  ethicsDescription: z.string().optional(),
  boundaryScore: z.number().min(SCORE_MIN).max(SCORE_MAX),
  boundaryDescription: z.string().optional(),
  supportiveScore: z.number().min(SCORE_MIN).max(SCORE_MAX),
  supportiveDescription: z.string().optional(),
  
  // 服务信息
  serviceCity: z.string().optional(),
  residenceInfo: z.string().optional(),
  residenceZipcode: z.string().optional(),
  residenceStartDate: z.string().optional(),
  occupation: z.string().optional(),
  bio: z.string().optional(),
  
  // 资质信息
  qualifications: z
    .object({
      certifications: z
        .record(
          z.string(),  // ✅ 明确 key 类型
          z.object({
            description: z.string().optional(),
            proof: z.string().optional(),
            visible: z.boolean().default(true),
          }),
        )
        .optional(),
    })
    .optional(),
  languages: z.array(z.string()).optional(),
  experienceDuration: z.string().optional(),
  experienceSession: z.string().optional(),
  
  // 个性化问题
  q1Interaction: z.string().optional(),
  q2FavSpot: z.string().optional(),
  q3BoundaryResponse: z.string().optional(),
  q4EmotionalHandling: z.string().optional(),
  q5SelfSymbol: z.string().optional(),
  
  // 服务类型与偏好
  serviceSelections: z.array(z.coerce.number().int()).min(1, "请至少选择一个服务类型").default([]),
  targetGroup: z.array(z.enum(["individual", "couple", "family", "group", "child", "elderly", "business"])).min(1, "请至少选择一个服务对象").default([]),
  minPeople: z.coerce.number().int().min(MIN_PEOPLE, `最少人数不能少于${MIN_PEOPLE}`).max(MAX_PEOPLE, `最少人数不能超过${MAX_PEOPLE}`).optional(),
  maxPeople: z.coerce.number().int().min(MIN_PEOPLE, `最多人数不能少于${MIN_PEOPLE}`).max(MAX_PEOPLE, `最多人数不能超过${MAX_PEOPLE}`).optional(),
  minDuration: z.coerce.number().int().min(MIN_DURATION, `最短时长不能少于${MIN_DURATION}小时`).max(24, "最短时长不能超过24小时").optional(),
  maxDuration: z.coerce.number().int().min(MIN_DURATION, `最长时长不能少于${MIN_DURATION}小时`).max(24, "最长时长不能超过24小时").optional(),
  basicPricePerHour: z.coerce.number().min(0, "基础时薪不能为负数").optional(),
  additionalPricePerPerson: z.coerce.number().min(0, "额外人员费用不能为负数").optional(),
  basicPricePerHourCents: z.coerce.number().int().min(0, "基础时薪不能为负数").optional(),
  additionalPricePerPersonCents: z.coerce.number().int().min(0, "额外人员费用不能为负数").optional(),
  currency: z.enum(["JPY", "USD", "CNY"]).default("JPY"),
})
.refine((data) => !data.maxPeople || !data.minPeople || data.maxPeople >= data.minPeople, {
  message: "最多人数必须大于或等于最少人数",
  path: ["maxPeople"],
})
.refine((data) => !data.maxDuration || !data.minDuration || data.maxDuration >= data.minDuration, {
  message: "最长时长必须大于或等于最短时长",
  path: ["maxDuration"],
});

export type FormData = z.infer<typeof formSchema>;

// API 配置类型
export interface GuideFormConfig {
  // API 端点配置
  apiEndpoints: {
    saveDraft: string;
    submitApplication: string;
    loadDraft?: string;
    serviceCategories?: string;
  };
  
  // 身份验证配置
  auth: {
    getToken: () => string | null;
    getUserId: () => number | null;
  };
  
  // 回调函数
  callbacks: {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
    onSaveDraft?: (data: any) => void;
  };
  
  // UI 配置
  ui?: {
    showProgressBar?: boolean;
    showPreview?: boolean;
    customTitle?: string;
    customDescription?: string;
  };
}

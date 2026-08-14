import { z } from "zod";
import {
  MAX_AGE,
  MAX_DURATION,
  MAX_PEOPLE,
  MBTI_OPTIONS,
  MIN_AGE,
  MIN_DURATION,
  MIN_PEOPLE,
  SCORE_MAX,
  SCORE_MIN,
} from "../constants";

const normalizeSexInput = (sex: unknown) =>
  sex === "Prefer not to say" || sex === "preferNotToSay" ? "prefer_not_to_say" : sex;

const certificationSchema = z
  .object({
    description: z.string().optional(),
    proof: z.string().optional(),
    visible: z.boolean().default(true).optional(),
    uploaded: z.boolean().optional(),
    publicUrl: z.string().optional(),
    data: z.string().optional(),
    name: z.string().optional(),
    type: z.string().optional(),
    size: z.number().optional(),
    fileId: z.string().optional(),
    stagedFileId: z.string().optional(),
  })
  .passthrough();

export const formSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    userId: z.number().optional(),
    applicationStatus: z
      .enum(["drafted", "pending", "under_review", "approved", "rejected", "needs_more_info"])
      .optional(),

    name: z.string().min(1, "Please enter your name"),
    age: z
      .number()
      .min(MIN_AGE, `Age must be at least ${MIN_AGE}`)
      .max(MAX_AGE, `Age must not exceed ${MAX_AGE}`),
    sex: z.preprocess(normalizeSexInput, z.enum(["Male", "Female", "prefer_not_to_say"])),
    mbti: z.enum(MBTI_OPTIONS as [string, ...string[]]).optional(),
    socialProfile: z.string().optional(),

    assessmentQ1: z.array(z.string()).default([]),
    assessmentQ1Slider: z.number().min(SCORE_MIN).max(SCORE_MAX).nullable().optional(),
    assessmentQ2: z.string().default(""),
    assessmentQ3: z.string().default(""),
    assessmentQ3Slider: z.number().min(SCORE_MIN).max(SCORE_MAX).nullable().optional(),
    assessmentQ4: z.array(z.string()).default([]),
    assessmentQ4Slider: z.number().min(SCORE_MIN).max(SCORE_MAX).nullable().optional(),

    serviceCity: z.string().optional(),
    residenceInfo: z.string().optional(),
    residenceZipcode: z
      .string()
      .regex(/^\d{7}$/, "Postal code must be 7 digits")
      .optional()
      .or(z.literal("")),
    residenceStartDate: z.string().optional(),
    occupation: z.string().optional(),
    bio: z.string().optional(),

    qualifications: z
      .object({
        certifications: z.record(z.string(), certificationSchema).optional(),
      })
      .optional(),
    languages: z.array(z.string()).optional(),
    experienceDuration: z.string().optional(),
    experienceSession: z.string().optional(),

    personalizedQ5: z.array(z.string()).default([]),
    personalizedQ5Slider: z.number().min(SCORE_MIN).max(SCORE_MAX).nullable().optional(),
    personalizedQ6: z.array(z.string()).default([]),
    personalizedQ6Slider: z.number().min(SCORE_MIN).max(SCORE_MAX).nullable().optional(),
    personalizedQ7: z.string().default(""),
    personalizedQ7Slider: z.number().min(SCORE_MIN).max(SCORE_MAX).nullable().optional(),
    personalizedQ8Strengths: z.array(z.string()).max(3).default([]),
    personalizedQ8Slider: z.number().min(SCORE_MIN).max(SCORE_MAX).nullable().optional(),
    personalizedQ8Example: z.string().max(100).default(""),
    personalizedQ9: z.string().max(50).default(""),

    serviceSelections: z.array(z.coerce.number().int()).default([]),
    targetGroup: z
      .array(
        z.enum(["individual", "couple", "family", "group", "child", "elderly", "business"])
      )
      .default([]),
    minPeople: z.coerce
      .number()
      .int()
      .min(MIN_PEOPLE, `Minimum group size must be at least ${MIN_PEOPLE}`)
      .max(MAX_PEOPLE, `Minimum group size must not exceed ${MAX_PEOPLE}`)
      .optional(),
    maxPeople: z.coerce
      .number()
      .int()
      .min(MIN_PEOPLE, `Maximum group size must be at least ${MIN_PEOPLE}`)
      .max(MAX_PEOPLE, `Maximum group size must not exceed ${MAX_PEOPLE}`)
      .optional(),
    minDuration: z.coerce
      .number()
      .int()
      .min(MIN_DURATION, `Minimum duration must be at least ${MIN_DURATION} hours`)
      .max(24, "Minimum duration must not exceed 24 hours")
      .optional(),
    maxDuration: z.coerce
      .number()
      .int()
      .min(MIN_DURATION, `Maximum duration must be at least ${MIN_DURATION} hours`)
      .max(24, "Maximum duration must not exceed 24 hours")
      .optional(),
    basicPricePerHour: z.coerce.number().min(0, "Base hourly rate cannot be negative").optional(),
    additionalPricePerPerson: z.coerce
      .number()
      .min(0, "Additional per-person hourly rate cannot be negative")
      .optional(),
    basicPricePerHourCents: z.coerce
      .number()
      .int()
      .min(0, "Base hourly rate cannot be negative")
      .optional(),
    additionalPricePerPersonCents: z.coerce
      .number()
      .int()
      .min(0, "Additional per-person hourly rate cannot be negative")
      .optional(),
    currency: z.literal("USD").default("USD"),

    draftMetadata: z
      .object({
        clientDraftId: z.string().optional(),
        handedOffAt: z.string().optional(),
        anonymousDraftVersion: z.number().optional(),
      })
      .optional(),
  })
  .refine((data) => !data.maxPeople || !data.minPeople || data.maxPeople >= data.minPeople, {
    message: "Maximum group size must be greater than or equal to minimum group size",
    path: ["maxPeople"],
  })
  .refine(
    (data) => !data.maxDuration || !data.minDuration || data.maxDuration >= data.minDuration,
    {
      message: "Maximum duration must be greater than or equal to minimum duration",
      path: ["maxDuration"],
    }
  );

export type FormData = z.infer<typeof formSchema>;

export type GuideFunnelState =
  | "anonymous_editing"
  | "auth_required"
  | "verification_required"
  | "resume_after_auth"
  | "authenticated_editing"
  | "preview"
  | "submitted";

export type GuideDraftConflictReason =
  | "existing_server_draft"
  | "submitted_application"
  | "idempotent_handoff"
  | "stale_local_draft"
  | "local_newer";

export interface GuideDraftConflict {
  code: string;
  reason: GuideDraftConflictReason;
  serverDraft?: {
    id?: string | number;
    updatedAt?: string;
    applicationStatus?: string;
    lastMeaningfulState?: string;
  };
  clientDraft?: {
    clientDraftId?: string;
    updatedAt?: string;
    anonymousDraftVersion?: number;
  };
}

export interface GuideFormConfig {
  draftOwnershipMode?: "anonymous_until_checkpoint" | "authenticated_from_start";

  apiEndpoints: {
    saveDraft?: string;
    submitApplication: string;
    loadDraft?: string;
    handoffDraft?: string;
    serviceCategories?: string;
    qualificationUpload?: string;
    archivePdf?: (applicationId: string | number) => string;
    updateApplication?: (applicationId: string | number) => string;
  };

  resolveApiUrl?: (path: string) => string;

  auth: {
    getToken: () => string | null;
    getUserId: () => number | null;
    getUser?: () => { emailVerified?: boolean; emailverified?: boolean; [key: string]: unknown } | null;
    isEmailVerified?: () => boolean;
  };

  callbacks: {
    onSuccess?: (data: unknown) => void;
    onError?: (error: unknown) => void;
    onSaveDraft?: (data: unknown) => void;
    onAuthRequired?: (redirectTo: string) => void;
    onVerificationRequired?: (redirectTo: string) => void;
    onHandoffSuccess?: (data: unknown) => void;
    onHandoffConflict?: (conflict: GuideDraftConflict) => void;
    onDraftLoaded?: (data: unknown) => void;
    onNavigateToStatus?: () => void;
  };

  routes?: {
    signup?: string;
    login?: string;
    verifyEmail?: string;
    resumePath?: string;
  };

  ui?: {
    showProgressBar?: boolean;
    showPreview?: boolean;
    customTitle?: string;
    customDescription?: string;
  };
}

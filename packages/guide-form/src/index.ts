// 主要组件
export { GuideForm } from "./components/GuideForm";
export { useGuideForm } from "./hooks/useGuideForm";

// PDF功能组件
export { PrintAndSave } from "./components/PrintAndSave";
export { usePDFGeneration } from "./hooks/usePDFGeneration";

// 申请状态相关组件
export { default as ApplicationStatus } from "./components/ApplicationStatus";
export { ApprovalTimeline } from "./components/ApprovalTimeline";
export { SupplementalMaterialsUpload } from "./components/SupplementalMaterialsUpload";
export { useApprovalTimeline } from "./hooks/useApprovalTimeline";
export { useApplicationStatus } from "./hooks/useApplicationStatus";

// 类型定义
export type { 
  FormData, 
  GuideFormConfig 
} from "./types/schema";
export type { UIComponents } from "./components/GuideForm";
export type { PrintAndSaveProps } from "./components/PrintAndSave";
export type { UsePDFGenerationOptions } from "./hooks/usePDFGeneration";
export type { ApprovalTimelineEntry } from "./hooks/useApprovalTimeline";

// 工具函数
export { validateFormCompleteness } from "./utils/validation";

// PDF工具函数
export {
  generatePDFBlob,
  downloadPDF,
  uploadPDF,
  generateAndDownloadPDF,
  generateAndUploadPDF,
  generateDownloadAndUploadPDF,
  defaultPDFOptions,
} from "./utils/pdfGenerator";
export type { PDFOptions, PDFUploadOptions } from "./utils/pdfGenerator";

// 常量
export {
  MBTI_OPTIONS,
  SEX_OPTIONS,
  PAGE_TITLES,
  TOTAL_PAGES,
  SCORE_MIN,
  SCORE_MAX,
  MIN_AGE,
  MAX_AGE,
  MIN_PEOPLE,
  MAX_PEOPLE,
  MIN_DURATION,
  MAX_DURATION,
  CURRENCY_OPTIONS,
  SCORE_EXPLANATIONS
} from "./constants";

// 表单验证 schema
export { formSchema } from "./types/schema";

// Toast 组件和 hooks
export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from "./components/ui/toast";
export { toast, useToast } from "./hooks/use-toast";
export { Toaster } from "./components/ui/toaster";
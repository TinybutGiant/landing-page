import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, type FormData, type GuideFormConfig } from "../types/schema";
import { validateFormCompleteness } from "../utils/validation";
import { processFormDataForDatabase, processDatabaseDataForForm } from "../utils/currencyUtils";
import { prepareEvaluationPayload } from "../utils/evaluationPayload";

export const useGuideForm = (
  config: GuideFormConfig,
  onLoadLocalStorage?: () => any,
  onSaveLocalStorage?: (data: any) => void,
  onClearLocalStorage?: () => void,
  initialStep?: 'preview'
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [savedData, setSavedData] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitRequestIdRef = useRef<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      age: 18,
      sex: "Male" as const,
      mbti: "ENFJ" as const,
      socialProfile: "",
      assessmentQ1: [],
      assessmentQ1Slider: undefined,
      assessmentQ2: "",
      assessmentQ3: "",
      assessmentQ3Slider: undefined,
      assessmentQ4: [],
      assessmentQ4Slider: undefined,
      serviceCity: "",
      residenceInfo: "",
      residenceZipcode: "",
      residenceStartDate: "",
      occupation: "",
      bio: "",
      qualifications: {
        certifications: {},
      },
      languages: [],
      experienceDuration: "",
      experienceSession: "",
      personalizedQ5: [],
      personalizedQ5Slider: undefined,
      personalizedQ6: [],
      personalizedQ6Slider: undefined,
      personalizedQ7: "",
      personalizedQ7Slider: undefined,
      personalizedQ8Strengths: [],
      personalizedQ8Slider: undefined,
      personalizedQ8Example: "",
      personalizedQ9: "",
      serviceSelections: [],
      targetGroup: [],
      minPeople: 1,
      maxPeople: 10,
      minDuration: 2,
      maxDuration: 8,
      basicPricePerHour: 30.00,
      additionalPricePerPerson: 5.00,
      ...savedData,
      currency: "USD" as const,
    },
  });

  // 从localStorage加载数据
  useEffect(() => {
    if (onLoadLocalStorage) {
      const localData = onLoadLocalStorage();
      if (localData) {
        setSavedData(localData);
        form.reset({
          ...form.getValues(),
          ...localData,
          currency: "USD" as const,
        });
        console.log('已从localStorage恢复数据');
      }
    }
  }, [onLoadLocalStorage, form]);

  // 处理初始步骤
  useEffect(() => {
    if (initialStep === 'preview') {
      setShowPreview(true);
    }
  }, [initialStep]);

  // 保存草稿到localStorage
  const saveDraft = async (data: FormData) => {
    try {
      setIsSaving(true);
      
      // 只保存到localStorage
      if (onSaveLocalStorage) {
        onSaveLocalStorage(data);
      }
      
      setSavedData(data);
      config.callbacks.onSaveDraft?.(data);
    } catch (error) {
      console.error("Save draft error:", error);
      config.callbacks.onError?.(error);
    } finally {
      setIsSaving(false);
    }
  };

  // 数据库提交申请
  const submitToDatabase = async (data: FormData) => {
    try {
      const token = config.auth.getToken();
      const userId = config.auth.getUserId();
      
      // 处理资质文件上传，避免413错误
      let processedData = { ...data };
      
      // 如果有资质文件，先上传到服务器
      if (data.qualifications && data.qualifications.certifications) {
        console.log('处理资质文件上传...');
        const certifications = data.qualifications.certifications;
        const uploadedCertifications: any = {};
        
        for (const [key, fileData] of Object.entries(certifications)) {
          const file = fileData as any;
          if (file.uploaded && file.publicUrl) {
            // 已经上传过的文件，直接使用URL
            uploadedCertifications[key] = {
              description: file.description || '',
              proof: file.publicUrl,
              visible: file.visible !== false
            };
          } else if (file.data) {
            // 需要上传的文件
            try {
              console.log(`开始上传文件: ${file.name}`);
              
              // 将base64转换为Blob
              const response = await fetch(file.data);
              const blob = await response.blob();
              
              // 创建FormData
              const formData = new FormData();
              formData.append('file', blob, file.name);
              
              // 上传到R2 - 使用主项目的资质文件上传API（相对路径，vite代理处理）
              const uploadResponse = await fetch('/api/v2/guide-applications/qualification-upload', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`
                },
                body: formData
              });
              
              if (!uploadResponse.ok) {
                throw new Error(`文件上传失败: ${uploadResponse.status}`);
              }
              
              const result = await uploadResponse.json();
              console.log(`文件上传成功: ${file.name}`, result);
              
              uploadedCertifications[key] = {
                description: file.description || '',
                proof: result.publicUrl,
                visible: file.visible !== false
              };
            } catch (error) {
              console.error(`文件上传失败: ${file.name}`, error);
              throw error;
            }
          }
        }
        
        processedData.qualifications = {
          ...data.qualifications,
          certifications: uploadedCertifications
        };
      }
      
      console.log('提交数据大小:', JSON.stringify(processedData).length, 'bytes');
      
      const response = await fetch(config.apiEndpoints.submitApplication, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(processFormDataForDatabase(
          prepareEvaluationPayload({
            ...processedData,
            userId: userId,
            applicationStatus: "pending"
          })
        ))
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API响应错误:', response.status, errorText);
        throw new Error(`提交失败: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      // 存储申请ID到localStorage，供PDF上传使用
      const applicationId = result.id || result.applicationId || result.application?.id;
      
      if (applicationId) {
        localStorage.setItem('yaotu_application_id', applicationId.toString());
        console.log('✅ 申请ID已保存到localStorage:', applicationId);
      } else {
        console.warn('⚠️ 未找到申请ID，服务器返回:', result);
      }
      
      return result;
    } catch (error) {
      console.error('Database submission error:', error);
      throw error;
    }
  };

  // 提交申请 - 检查认证状态，如果未登录则跳转到登录页面
  const submitApplication = async (data: FormData) => {
    // 生成唯一的请求ID
    const requestId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    // 防止重复提交 - 使用ref来确保即使在StrictMode下也只提交一次
    if (isSubmitting || submitRequestIdRef.current !== null) {
      console.log('⚠️ 提交正在进行中或已处理，忽略重复请求');
      return;
    }
    
    try {
      setIsLoading(true);
      setIsSubmitting(true);
      submitRequestIdRef.current = requestId;
      
      console.log(`🚀 开始提交申请，请求ID: ${requestId}`);
      
      // 检查用户是否已登录
      const token = config.auth.getToken();
      const userId = config.auth.getUserId();
      
      if (!token || !userId) {
        // 未登录，跳转到注册页面，确保包含step=preview参数
        const currentUrl = window.location.pathname + window.location.search;
        // 如果是become-guide页面，确保包含step=preview参数
        const redirectUrl = currentUrl.includes('step=preview') ? currentUrl : '/become-guide?step=preview';
        window.location.href = `/signup?redirect=${encodeURIComponent(redirectUrl)}`;
        return;
      }
      
      // 已登录，提交到数据库
      const finalData = {
        ...data,
        userId: userId,
        applicationStatus: "pending",
        requestId: requestId, // 添加请求ID用于调试
      };
      
      // 提交到数据库
      await submitToDatabase(finalData);
      
      console.log(`✅ 申请提交成功，请求ID: ${requestId}`);
      
      // 调用成功回调
      config.callbacks.onSuccess?.(finalData);
      
    } catch (error) {
      console.error(`❌ 申请提交失败，请求ID: ${requestId}`, error);
      config.callbacks.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
      // 不重置requestId，保持防重复提交状态
    }
  };

  // 保存当前页面数据
  const saveCurrentPageData = () => {
    const currentData = form.getValues();
    saveDraft(currentData);
  };

  // 导航函数
  const nextPage = () => {
    if (currentPage < 4) {
      // 翻页时自动保存草稿（失败不阻断）
      try {
        saveCurrentPageData();
      } catch (_) {
        // ignore autosave errors
      }
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPreview = () => {
    // 进入预览前尝试保存草稿（失败不阻断）
    try {
      saveCurrentPageData();
    } catch (_) {
      // ignore autosave errors
    }
    setShowPreview(true);
  };

  const backToForm = () => {
    setShowPreview(false);
  };

  const onSubmit = async () => {
    // 防止重复提交
    if (isSubmitting) {
      console.log('⚠️ 提交正在进行中，忽略重复请求');
      return;
    }
    
    const finalData = form.getValues();
    await submitApplication(finalData);
  };

  // 文件上传处理
  const handleQualificationFilesChange = (files: any) => {
    form.setValue("qualifications.certifications", files);
  };

  return {
    // 状态
    currentPage,
    setCurrentPage,
    showPreview,
    setShowPreview,
    confirmationChecked,
    setConfirmationChecked,
    missingFields,
    setMissingFields,
    savedData,
    setSavedData,
    isLoading,
    isSaving,
    isSubmitting,

    // 表单
    form,

    // 方法
    saveCurrentPageData,
    handleQualificationFilesChange,
    saveDraft,
    submitApplication,
    nextPage,
    prevPage,
    goToPreview,
    backToForm,
    onSubmit,
    validateFormCompleteness,
  };
};

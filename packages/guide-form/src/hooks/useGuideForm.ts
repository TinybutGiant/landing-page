import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, type FormData, type GuideFormConfig } from "../types/schema";
import { validateFormCompleteness } from "../utils/validation";

export const useGuideForm = (
  config: GuideFormConfig,
  onLoadLocalStorage?: () => any,
  onSaveLocalStorage?: (data: any) => void,
  onClearLocalStorage?: () => void
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [savedData, setSavedData] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      age: 18,
      sex: "Male" as const,
      mbti: "ENFJ" as const,
      socialProfile: "",
      ethicsScore: 5,
      ethicsDescription: "",
      boundaryScore: 5,
      boundaryDescription: "",
      supportiveScore: 5,
      supportiveDescription: "",
      serviceCity: "",
      residenceInfo: "",
      residenceStartDate: "",
      occupation: "",
      bio: "",
      qualifications: {
        certifications: {},
      },
      languages: [],
      experienceDuration: "",
      experienceSession: "",
      q1Interaction: "",
      q2FavSpot: "",
      q3BoundaryResponse: "",
      q4EmotionalHandling: "",
      q5SelfSymbol: "",
      serviceSelections: [],
      targetGroup: [],
      minPeople: 1,
      maxPeople: 10,
      minDuration: 2,
      maxDuration: 8,
      basicPricePerHourCents: 3000,
      additionalPricePerPersonCents: 500,
      currency: "JPY" as const,
      ...savedData,
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
        });
        console.log('已从localStorage恢复数据');
      }
    }
  }, [onLoadLocalStorage, form]);

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
      
      const response = await fetch(config.apiEndpoints.submitApplication, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          userId: userId,
          applicationStatus: "pending"
        })
      });

      if (!response.ok) {
        throw new Error('提交失败');
      }

      return await response.json();
    } catch (error) {
      console.error('Database submission error:', error);
      throw error;
    }
  };

  // 提交申请 - 检查认证状态，如果未登录则跳转到登录页面
  const submitApplication = async (data: FormData) => {
    try {
      setIsLoading(true);
      
      // 检查用户是否已登录
      const token = config.auth.getToken();
      const userId = config.auth.getUserId();
      
      if (!token || !userId) {
        // 未登录，跳转到登录页面
        const currentUrl = window.location.pathname;
        window.location.href = `/login?redirect=${encodeURIComponent(currentUrl)}`;
        return;
      }
      
      // 已登录，提交到数据库
      const finalData = {
        ...data,
        userId: userId,
        applicationStatus: "pending",
      };
      
      // 提交到数据库
      await submitToDatabase(finalData);
      
      // 调用成功回调
      config.callbacks.onSuccess?.(finalData);
      
    } catch (error) {
      console.error("Submit application error:", error);
      config.callbacks.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
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

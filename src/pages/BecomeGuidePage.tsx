import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useRoute } from 'wouter';
import { GuideForm, GuideFormConfig, UIComponents } from '@replit/guide-form';
import { usePDFGeneration, generatePDFBlob } from '@replit/guide-form';
import { api, authApi, resolveApiUrl } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Info 
} from 'lucide-react';
import { YearMonthPicker } from '@/components/YearMonthPicker';
import { useIntl } from 'react-intl';
import { useLanguage } from '@/i18n/LanguageProvider';

const BecomeGuidePage: React.FC = () => {
  // Toast hook
  const { toast } = useToast();
  const intl = useIntl();
  const { locale } = useLanguage();
  
  // Wouter navigation
  const [location, setLocation] = useLocation();
  
  // 获取URL参数
  const urlParams = new URLSearchParams(window.location.search);
  const step = urlParams.get('step');
  const redirectTo = urlParams.get('redirect');
  
  // localStorage 相关功能
  const STORAGE_KEY = 'yaotu_guide_form_draft';
  const normalizeSexValue = (sex: unknown) =>
    sex === 'Prefer not to say' || sex === 'preferNotToSay' ? 'prefer_not_to_say' : sex;
  
  // 状态管理localStorage数据（用于调试）
  const [, setInitialDraft] = React.useState<any>(null);
  
  // 状态管理
  const [applicationId] = React.useState<string>('');
  const [formData, setFormData] = React.useState<any>(null);
  
  // PDF生成hook - 仅用于提交时的上传
  const { uploadPDF } = usePDFGeneration({
    onSuccess: (fileKey) => {
      console.log("PDF generated successfully!", fileKey);
    },
    onError: (error: Error) => {
      console.error("PDF generation failed:", error);
    },
  });
  
  // 从localStorage加载数据
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const data = saved ? JSON.parse(saved) : null;
      if (data && typeof data === 'object') {
        data.sex = normalizeSexValue(data.sex);
      }
      console.log('BecomeGuidePage: 从localStorage加载数据:', data);
      return data;
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      return null;
    }
  };

  // 保存到localStorage
  const saveToLocalStorage = (data: any) => {
    try {
      // 确保保存的数据包含所有必要字段
      const dataToSave = {
        ...data,
        // 添加时间戳
        savedAt: new Date().toISOString(),
        // 确保基本字段存在
        name: data.name || data.fullName || '',
        sex: normalizeSexValue(data.sex) || 'prefer_not_to_say',
        // 确保数组字段存在
        serviceSelections: data.serviceSelections || [],
        targetGroup: data.targetGroup || [],
        languages: data.languages || data.languageSkills || [],
        // 确保对象字段存在
        qualifications: data.qualifications || {}
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      console.log('BecomeGuidePage: 数据已保存到localStorage, key:', STORAGE_KEY, 'data:', dataToSave);
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  };

  // 清除localStorage
  const clearLocalStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('BecomeGuidePage: localStorage已清除, key:', STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  };



  // 检查用户是否已登录
  const checkAuth = () => {
    const token = localStorage.getItem("yaotu_token");
    const userId = localStorage.getItem("yaotu_user_id");
    return !!(token && userId);
  };

  // 测试代理连接
  const testProxyConnection = async () => {
    try {
      console.log('🧪 测试代理连接...');
      const data = await api.get('/api/v2/guide-applications/test');
      console.log('✅ 代理连接正常:', data);
      return true;
    } catch (error) {
      console.error('❌ 代理连接测试失败:', error);
      return false;
    }
  };

  // 获取localStorage中的所有数据
  const getAllLocalStorageData = () => {
    const allData: { [key: string]: any } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          allData[key] = JSON.parse(localStorage.getItem(key) || '');
        } catch {
          allData[key] = localStorage.getItem(key);
        }
      }
    }
    return allData;
  };

  // 上传资质文件到R2
  const uploadQualificationFiles = async (qualifications: any) => {
    if (!qualifications || !qualifications.certifications) {
      return qualifications;
    }
    
    const token = localStorage.getItem("yaotu_token");
    if (!token) {
      throw new Error('用户未登录');
    }
    
    const certifications = qualifications.certifications;
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
          
          // 上传到R2
          const result = await authApi.upload('/api/v2/guide-applications/qualification-upload', formData);
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
    
    return {
      ...qualifications,
      certifications: uploadedCertifications
    };
  };

  // 只处理PDF上传的函数（不重复提交申请）
  const handlePDFUpload = async (data: any) => {
    try {
      console.log('🔄 开始处理PDF上传...');
      
      // 从localStorage获取申请ID
      const applicationId = localStorage.getItem('yaotu_application_id');
      console.log('📋 从localStorage获取的申请ID:', applicationId);
      
      if (!applicationId) {
        console.warn('⚠️ 未找到申请ID，跳过PDF上传');
        console.log('🔍 当前localStorage内容:', Object.keys(localStorage).map(key => ({ key, value: localStorage.getItem(key) })));
        return;
      }
      
      console.log('📤 开始上传PDF到R2...');
      // 上传PDF到R2
      await uploadPDFToR2(data, applicationId);
      console.log('✅ PDF上传完成');
      
    } catch (error) {
      console.error('❌ PDF上传失败:', error);
      // PDF上传失败不影响申请提交
    }
  };

  // 上传PDF到R2并获取URL
  const uploadPDFToR2 = async (formData: any, applicationId: string | number) => {
    try {
      console.log('🔐 检查用户认证状态...');
      const token = localStorage.getItem("yaotu_token");
      const userId = localStorage.getItem("yaotu_user_id");
      
      if (!token || !userId) {
        throw new Error('用户未登录');
      }
      
      console.log('📄 开始生成PDF...');
      // 生成PDF Blob
      const pdfBlob = await generatePDFBlob("print-root", {
        filename: `guide-application-${applicationId}-${Date.now()}.pdf`
      });
      
      console.log('📄 PDF生成完成，大小:', pdfBlob.size, 'bytes');
      
      // 转换为ArrayBuffer
      const pdfArrayBuffer = await pdfBlob.arrayBuffer();
      console.log('📄 PDF转换为ArrayBuffer完成，大小:', pdfArrayBuffer.byteLength, 'bytes');
      
      console.log('📤 开始上传PDF到R2，申请ID:', applicationId);
      // 上传到R2
      const uploadResponse = await fetch(resolveApiUrl(`/api/v2/guide-applications/${applicationId}/archive-pdf`), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/pdf',
          'Content-Length': pdfArrayBuffer.byteLength.toString(),
        },
        body: pdfArrayBuffer
      });
      
      console.log('📤 上传响应状态:', uploadResponse.status);
      
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('❌ PDF上传失败，响应:', errorText);
        throw new Error(`PDF上传失败: ${uploadResponse.status} - ${errorText}`);
      }
      
      const uploadResult = await uploadResponse.json();
      console.log('✅ PDF上传成功，结果:', uploadResult);
      return uploadResult.publicUrl || uploadResult.url;
      
    } catch (error) {
      console.error('❌ PDF上传失败:', error);
      throw error;
    }
  };

  // 注意：submitToDatabase 函数现在由 useGuideForm hook 处理

  // 加载服务类别数据的函数
  const loadServiceCategories = async () => {
    try {
      console.log('BecomeGuidePage: 开始加载服务类别数据...');
      const data = await api.get('/api/v2/service-categories/with-subcategories');
      console.log('BecomeGuidePage: 服务类别数据加载成功:', data);
      return data;
    } catch (error) {
      console.error('BecomeGuidePage: 服务类别数据加载失败:', error);
      throw error;
    }
  };

  // 配置表单
  const config: GuideFormConfig = {
    resolveApiUrl,
    apiEndpoints: {
      saveDraft: '', // 不使用数据库保存草稿
      submitApplication: '/api/v2/guide-applications', // 数据库提交端点
      serviceCategories: '/api/v2/service-categories/with-subcategories' // 服务类别端点
    },
    auth: {
      getToken: () => localStorage.getItem("yaotu_token"),
      getUserId: () => {
        const userId = localStorage.getItem("yaotu_user_id");
        return userId ? parseInt(userId) : null;
      }
    },
    callbacks: {
      onSuccess: async (data: any) => {
        try {
          // 检查是否已登录
          if (checkAuth()) {
            // 处理PDF上传
            await handlePDFUpload(data);
            
            // 清除localStorage
            clearLocalStorage();
            // 清除资质文件缓存
            localStorage.removeItem('yaotu_qualification_files');
            
            // 显示成功消息并跳转
            toast({
              title: "申请提交成功！",
              description: "请登录主项目查看状态。",
              variant: "success"
            });
            setLocation('/');
          } else {
            // 未登录，不清除localStorage，跳转到登录页面
            console.log('用户未登录，跳转到登录页面');
            toast({
              title: "请先登录",
              description: "请先登录后再提交申请",
              variant: "destructive"
            });
            // 确保redirect URL包含step=preview参数
            const redirectUrl = '/become-guide?step=preview';
            const encodedRedirect = encodeURIComponent(redirectUrl);
            setLocation('/login?redirect=' + encodedRedirect);
          }
        } catch (error) {
          console.error('💥 BecomeGuidePage: 处理成功回调失败:', error);
          console.error('💥 错误类型:', typeof error);
          console.error('💥 错误名称:', error instanceof Error ? error.name : 'Unknown');
          console.error('💥 错误消息:', error instanceof Error ? error.message : String(error));
          console.error('💥 错误堆栈:', error instanceof Error ? error.stack : 'No stack trace');
          console.error('💥 完整错误对象:', error);
          console.error('💥 当前localStorage数据:', getAllLocalStorageData());
          
          // 检查是否是401认证错误
          if (error instanceof Error && error.message.includes('401')) {
            console.log('🔐 检测到401认证错误，跳转到登录页面');
            toast({
              title: "登录已过期",
              description: "请重新登录",
              variant: "destructive"
            });
            // 确保redirect URL包含step=preview参数
            const redirectUrl = '/become-guide?step=preview';
            const encodedRedirect = encodeURIComponent(redirectUrl);
            setLocation('/login?redirect=' + encodedRedirect);
            return;
          }
          
          // 处理失败时不清除localStorage，保留用户数据
          const errorMessage = error instanceof Error ? error.message : '请重试';
          toast({
            title: "处理失败",
            description: errorMessage,
            variant: "destructive"
          });
        }
      },
      onError: (error: any) => {
        console.warn('表单操作出现问题:', error);
        toast({
          title: "操作失败",
          description: "请重试",
          variant: "destructive"
        });
      },
      onSaveDraft: (data: any) => {
        console.log('草稿已保存到localStorage', data);
        // 保存表单数据到状态
        setFormData(data);
        // 只保存到localStorage
        saveToLocalStorage(data);
      }
    }
  };

  // 资质上传组件 - 支持localStorage缓存和R2上传
  const QualificationUploader = ({ onChange }: { onChange: (data: any) => void }) => {
    const [files, setFiles] = React.useState<File[]>([]);
    const [uploadedFiles, setUploadedFiles] = React.useState<any[]>([]);
    const [uploading, setUploading] = React.useState(false);
    
    // 从localStorage加载已缓存的文件
    React.useEffect(() => {
      const loadCachedFiles = () => {
        try {
          const cached = localStorage.getItem('yaotu_qualification_files');
          if (cached) {
            const cachedFiles = JSON.parse(cached);
            setUploadedFiles(cachedFiles);
            console.log('从localStorage加载资质文件:', cachedFiles);
          }
        } catch (error) {
          console.warn('加载缓存文件失败:', error);
        }
      };
      loadCachedFiles();
    }, []);
    
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files || []);
      setFiles(selectedFiles);
      
      // 将文件转换为base64并缓存到localStorage
      const filePromises = selectedFiles.map(async (file: File) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              name: file.name,
              type: file.type,
              size: file.size,
              data: reader.result,
              description: '',
              visible: true,
              uploaded: false
            });
          };
          reader.readAsDataURL(file);
        });
      });
      
      const fileData = await Promise.all(filePromises);
      const newUploadedFiles = [...uploadedFiles, ...fileData];
      setUploadedFiles(newUploadedFiles);
      
      // 保存到localStorage
      try {
        localStorage.setItem('yaotu_qualification_files', JSON.stringify(newUploadedFiles));
        console.log('资质文件已缓存到localStorage');
      } catch (error) {
        console.warn('保存到localStorage失败:', error);
      }
      
      // 更新表单数据
      onChange({ certifications: newUploadedFiles.reduce((acc: any, file: any, index: number) => {
        acc[`file_${index}`] = {
          name: file.name,
          type: file.type,
          size: file.size,
          description: file.description,
          visible: file.visible,
          data: file.data,
          uploaded: file.uploaded
        };
        return acc;
      }, {} as any) });
    };

    // 上传文件到R2
    const uploadFilesToR2 = async (files: any[]) => {
      const token = localStorage.getItem("yaotu_token");
      const userId = localStorage.getItem("yaotu_user_id");
      
      if (!token || !userId) {
        throw new Error('用户未登录');
      }
      
      const uploadPromises = files.map(async (file: any) => {
        if (file.uploaded) {
          return file; // 已经上传过的文件
        }
        
        try {
          // 将base64转换为Blob
          const response = await fetch(file.data);
          const blob = await response.blob();
          
          // 创建FormData
          const formData = new FormData();
          formData.append('file', blob, file.name);
          
          // 上传到R2
          const result = await authApi.upload('/api/v2/guide-applications/qualification-upload', formData);
          console.log('文件上传成功:', result);
          
          return {
            ...file,
            uploaded: true,
            r2Key: result.r2Key,
            publicUrl: result.publicUrl,
            fileId: result.fileId
          };
        } catch (error) {
          console.error('文件上传失败:', error);
          throw error;
        }
      });
      
      return await Promise.all(uploadPromises);
    };

    // 移除文件
    const removeFile = (index: number) => {
      const newFiles = uploadedFiles.filter((_, i) => i !== index);
      setUploadedFiles(newFiles);
      
      // 更新localStorage
      try {
        localStorage.setItem('yaotu_qualification_files', JSON.stringify(newFiles));
      } catch (error) {
        console.warn('更新localStorage失败:', error);
      }
      
      // 更新表单数据
      onChange({ certifications: newFiles.reduce((acc: any, file: any, index: number) => {
        acc[`file_${index}`] = {
          name: file.name,
          type: file.type,
          size: file.size,
          description: file.description,
          visible: file.visible,
          data: file.data,
          uploaded: file.uploaded
        };
        return acc;
      }, {} as any) });
    };

    // 更新文件描述
    const updateFileDescription = (index: number, description: string) => {
      const newFiles = [...uploadedFiles];
      newFiles[index] = { ...newFiles[index], description };
      setUploadedFiles(newFiles);
      
      // 更新localStorage
      try {
        localStorage.setItem('yaotu_qualification_files', JSON.stringify(newFiles));
      } catch (error) {
        console.warn('更新localStorage失败:', error);
      }
    };

    return (
      <div className="space-y-4">
        <div>
          <label htmlFor="qualification-files" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {intl.formatMessage({ id: 'becomeGuide.step1.uploadQualificationFiles' })}
            <span className="text-xs text-gray-500 ml-2">({intl.formatMessage({ id: 'becomeGuide.step1.uploadQualificationFilesDescription' })})</span>
          </label>
          <Input
            id="qualification-files"
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="mt-2"
            disabled={uploading}
          />
        </div>
        
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">{intl.formatMessage({ id: 'becomeGuide.step1.uploadedFiles' }, { current: uploadedFiles.length, max: 5 })}</p>
            {uploadedFiles.map((file: any, index: number) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded border">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    {file.uploaded && (
                      <span className="text-xs text-green-600">✓ {intl.formatMessage({ id: 'becomeGuide.step1.uploaded' })}</span>
                    )}
                  </div>
                  <Input
                    placeholder={intl.formatMessage({ id: 'becomeGuide.step1.fileDescriptionPlaceholder' })}
                    value={file.description}
                    onChange={(e) => updateFileDescription(index, e.target.value)}
                    className="mt-1 text-xs"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                  title={intl.formatMessage({ id: 'becomeGuide.step1.removeFile' })}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // 使用现有的 UI 组件
  const uiComponents: UIComponents = {
    // 基础表单组件（shadcn 规范）
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    
    // 输入组件
    Input, 
    Textarea, 
    Checkbox, 
    RadioGroup,
    RadioGroupItem,
    Button, 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle,
    
    // Select 组件
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    
    // 其他组件
    Progress,
    Slider,
    Badge,
    Separator,
    YearMonthPicker,
    
    // Tooltip 组件
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
    
    // 自定义组件
    QualificationUploader,
    
    // 图标组件
    Info, 
    ChevronLeft, 
    ChevronRight, 
    Save
  };

  // 城市数据
  const cities = [
    { value: 'tokyo', label: '东京' },
    { value: 'osaka', label: '大阪' },
    { value: 'kyoto', label: '京都' },
    { value: 'yokohama', label: '横滨' },
    { value: 'nagoya', label: '名古屋' }
  ];

  // 目标群体数据 - 只保留 value，label 通过国际化获取
  const targetGroups = [
    { value: 'individual' },
    { value: 'couple' },
    { value: 'family' },
    { value: 'group' },
    { value: 'child' },
    { value: 'elderly' },
    { value: 'business' }
  ];

  // 检查是否有localStorage中的申请数据
  React.useEffect(() => {
    console.log('BecomeGuidePage: 组件挂载，开始检查localStorage状态');
    console.log('当前域名:', window.location.hostname);
    console.log('当前协议:', window.location.protocol);
    
    // 未登录用户可以访问申请页面，但在提交时会要求登录
    
    // 检查所有localStorage数据
    const allLocalStorageData: { [key: string]: any } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          allLocalStorageData[key] = JSON.parse(localStorage.getItem(key) || '');
        } catch {
          allLocalStorageData[key] = localStorage.getItem(key);
        }
      }
    }
    console.log('BecomeGuidePage: 当前localStorage中的所有数据:', allLocalStorageData);
    
    // 测试代理连接
    const testConnections = async () => {
      console.log('🧪 开始测试连接...');
      
      // 测试代理连接
      const proxyOk = await testProxyConnection();
      
      // 测试服务类别API端点
      try {
        console.log('BecomeGuidePage: 测试服务类别API端点...');
        const data = await api.get('/api/v2/service-categories');
        console.log('BecomeGuidePage: 服务类别API响应成功:', data);
      } catch (error) {
        console.error('BecomeGuidePage: 服务类别API请求失败:', error);
      }
      
      if (!proxyOk) {
        console.warn('⚠️ 代理连接可能有问题，请检查vite开发服务器是否正在运行');
      }
    };
    
    testConnections();
    
    const savedData = loadFromLocalStorage();
    if (savedData) {
      console.log('=== 检测到localStorage中的申请数据 ===');
      console.log('申请数据:', savedData);
      console.log('用户可以从这里继续填写申请');
      setInitialDraft(savedData);
    } else {
      console.log('BecomeGuidePage: 未检测到保存的申请数据');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{intl.formatMessage({ id: 'becomeGuide.title' })}</h1>
                <p className="text-yellow-100 mt-2">{intl.formatMessage({ id: 'becomeGuide.subtitle' })}</p>
              </div>
              <button
                onClick={() => setLocation('/')}
                className="text-white/80 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto p-6">
          <TooltipProvider>
            <GuideForm
              config={config}
              ui={uiComponents}
              cities={cities}
              targetGroups={targetGroups}
              onLoadServiceCategories={loadServiceCategories}
              customTitle={intl.formatMessage({ id: 'becomeGuide.title' })}
              customDescription={intl.formatMessage({ id: 'becomeGuide.subtitle' })}
              showProgressBar={true}
              onLoadLocalStorage={loadFromLocalStorage}
              onSaveLocalStorage={saveToLocalStorage}
              onClearLocalStorage={clearLocalStorage}
              initialStep={step === 'preview' ? 'preview' : undefined}
            />
          </TooltipProvider>
        </div>


        {/* 隐藏的打印根元素 */}
        <div id="print-root" className="hidden print:block">
          {/* 这里的内容会在PDF生成时使用 */}
        </div>
      </motion.div>
    </div>
  );
};

export default BecomeGuidePage;

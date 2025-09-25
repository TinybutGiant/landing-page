import React from 'react';
import { motion } from 'framer-motion';
import { GuideForm, GuideFormConfig, UIComponents } from '@replit/guide-form';
import { usePDFGeneration } from '@replit/guide-form';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Info 
} from 'lucide-react';
import { YearMonthPicker } from '@/components/YearMonthPicker';

const BecomeGuidePage: React.FC = () => {
  // localStorage 相关功能
  const STORAGE_KEY = 'yaotu_guide_form_draft';
  
  // 状态管理localStorage数据（用于调试）
  const [, setInitialDraft] = React.useState<any>(null);
  
  // PDF功能状态
  const [showPDFPreview, setShowPDFPreview] = React.useState(false);
  const [applicationId] = React.useState<string>('');
  const [formData, setFormData] = React.useState<any>(null);
  
  // PDF生成hook
  const { downloadPDF, isProcessing } = usePDFGeneration({
    onSuccess: () => {
      console.log("PDF generated successfully!");
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
        sex: data.sex || 'Prefer not to say',
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

  // PDF相关处理函数
  const handleDownloadPDF = () => {
    if (!formData) {
      console.error('No form data available for PDF generation');
      return;
    }
    
    downloadPDF("print-root", {
      filename: `guide-application-${applicationId || 'draft'}.pdf`,
    });
  };

  const handleShowPDFPreview = () => {
    setShowPDFPreview(true);
  };

  const handleClosePDFPreview = () => {
    setShowPDFPreview(false);
  };


  // 检查用户是否已登录
  const checkAuth = () => {
    const token = localStorage.getItem("yaotu_token");
    const userId = localStorage.getItem("yaotu_user_id");
    return !!(token && userId);
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

  // 数据库提交申请
  const submitToDatabase = async (data: any) => {
    try {
      const token = localStorage.getItem("yaotu_token");
      
      // 使用正确的API端点 - 指向主项目服务器
      const API_BASE_URL = process.env.NODE_ENV === 'production' 
        ? 'https://your-production-api.com' 
        : 'http://localhost:5000';
      
      console.log('=== 🚀 开始提交申请到数据库 ===');
      console.log('📡 API端点:', `${API_BASE_URL}/api/v2/guide-applications`);
      console.log('🔑 认证Token:', token ? `${token.substring(0, 20)}...` : '未找到Token');
      console.log('📊 原始提交数据:', data);
      console.log('📊 提交数据类型:', typeof data);
      console.log('📊 提交数据键:', Object.keys(data));
      console.log('📊 提交数据完整详情:', JSON.stringify(data, null, 2));
      
      // 提取实际的表单数据
      const formData = data.data || data;
      console.log('🔍 提取的表单数据:', formData);
      console.log('🔍 表单数据类型:', typeof formData);
      console.log('🔍 表单数据键:', Object.keys(formData));
      console.log('🔍 表单数据完整详情:', JSON.stringify(formData, null, 2));
      
      // 构建最终发送给API的数据
      console.log('⚙️ 开始构建最终API数据...');
      const finalData = {
        // 数据转换：将前端表单数据转换为后端API期望的格式
        ...formData,
        // 确保必需字段存在
        name: formData.name || formData.fullName || '未填写',
        sex: formData.sex || 'Prefer not to say',
        // 转换服务选择数据
        serviceSelections: formData.serviceSelections || [],
        targetGroup: formData.targetGroup || [],
        // 转换人数设置
        minPeople: formData.minPeople || formData.minPeopleCount || 1,
        maxPeople: formData.maxPeople || formData.maxPeopleCount || 10,
        // 转换时长设置
        minDuration: formData.minDuration || formData.minDurationHours || 1,
        maxDuration: formData.maxDuration || formData.maxDurationHours || 8,
        // 转换价格设置
        basePrice: formData.basePrice || formData.hourlyRate || 0,
        // 转换其他字段
        bio: formData.bio || formData.description || '',
        languages: formData.languages || formData.languageSkills || [],
        experienceDuration: formData.experienceDuration || formData.experience || '',
        experienceSession: formData.experienceSession || formData.sessions || '',
        // 转换服务城市
        serviceCity: formData.serviceCity || formData.city || '',
        // 转换居住信息
        residenceInfo: formData.residenceInfo || formData.residence || '',
        residenceStartDate: formData.residenceStartDate || formData.residenceStart || null,
        occupation: formData.occupation || formData.job || '',
        // 转换自我评估
        ethicsScore: formData.ethicsScore || 0,
        ethicsDescription: formData.ethicsDescription || '',
        boundaryScore: formData.boundaryScore || 0,
        boundaryDescription: formData.boundaryDescription || '',
        supportiveScore: formData.supportiveScore || 0,
        supportiveDescription: formData.supportiveDescription || '',
        // 转换灵魂提问
        q1Interaction: formData.q1Interaction || formData.q1 || '',
        q2FavSpot: formData.q2FavSpot || formData.q2 || '',
        q3BoundaryResponse: formData.q3BoundaryResponse || formData.q3 || '',
        q4EmotionalHandling: formData.q4EmotionalHandling || formData.q4 || '',
        q5SelfSymbol: formData.q5SelfSymbol || formData.q5 || '',
        // 转换资质信息
        qualifications: formData.qualifications || {},
        // 转换其他可选字段
        age: formData.age || null,
        mbti: formData.mbti || null,
        socialProfile: formData.socialProfile || formData.socialMedia || '',
        // 设置申请状态
        applicationStatus: 'pending'
      };
      
      console.log('✅ 最终发送给API的数据:', finalData);
      console.log('✅ 最终数据详情:', JSON.stringify(finalData, null, 2));
      console.log('✅ 最终数据字段统计:');
      console.log('  - 基本信息字段:', Object.keys(finalData).filter(key => 
        ['name', 'age', 'sex', 'mbti', 'socialProfile'].includes(key)
      ));
      console.log('  - 服务信息字段:', Object.keys(finalData).filter(key => 
        ['serviceCity', 'residenceInfo', 'residenceStartDate', 'occupation', 'bio'].includes(key)
      ));
      console.log('  - 评估字段:', Object.keys(finalData).filter(key => 
        ['ethicsScore', 'ethicsDescription', 'boundaryScore', 'boundaryDescription', 'supportiveScore', 'supportiveDescription'].includes(key)
      ));
      console.log('  - 问题字段:', Object.keys(finalData).filter(key => 
        ['q1Interaction', 'q2FavSpot', 'q3BoundaryResponse', 'q4EmotionalHandling', 'q5SelfSymbol'].includes(key)
      ));
      console.log('  - 服务设置字段:', Object.keys(finalData).filter(key => 
        ['serviceSelections', 'targetGroup', 'minPeople', 'maxPeople', 'minDuration', 'maxDuration', 'basePrice'].includes(key)
      ));
      
      console.log('🌐 发送HTTP请求到API...');
      const response = await fetch(`${API_BASE_URL}/api/v2/guide-applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalData)
      });

      console.log('📡 HTTP响应状态:', response.status, response.statusText);
      console.log('📡 HTTP响应头:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API响应错误:', response.status, errorText);
        console.error('❌ 错误详情:', {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText,
          url: response.url,
          headers: Object.fromEntries(response.headers.entries())
        });
        throw new Error(`提交失败: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('🎉 申请成功提交到数据库!');
      console.log('🎉 服务器响应:', result);
      console.log('🎉 响应数据类型:', typeof result);
      console.log('🎉 响应数据键:', Object.keys(result));
      console.log('🎉 响应数据详情:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('💥 数据库提交错误:', error);
      console.error('💥 错误类型:', typeof error);
      console.error('💥 错误名称:', error instanceof Error ? error.name : 'Unknown');
      console.error('💥 错误消息:', error instanceof Error ? error.message : String(error));
      console.error('💥 错误堆栈:', error instanceof Error ? error.stack : 'No stack trace');
      console.error('💥 完整错误对象:', error);
      throw error;
    }
  };

  // 加载服务类别数据的函数
  const loadServiceCategories = async () => {
    try {
      console.log('BecomeGuidePage: 开始加载服务类别数据...');
      const response = await fetch('/api/v2/service-categories/with-subcategories');
      if (response.ok) {
        const data = await response.json();
        console.log('BecomeGuidePage: 服务类别数据加载成功:', data);
        return data;
      } else {
        console.error('BecomeGuidePage: 服务类别API响应失败:', response.status, response.statusText);
        throw new Error(`API响应失败: ${response.status}`);
      }
    } catch (error) {
      console.error('BecomeGuidePage: 服务类别数据加载失败:', error);
      throw error;
    }
  };

  // 配置表单
  const config: GuideFormConfig = {
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
            // 已登录，输出当前token、用户ID和localStorage数据
            const token = localStorage.getItem("yaotu_token");
            const userId = localStorage.getItem("yaotu_user_id");
            const allLocalStorageData = getAllLocalStorageData();
            
            console.log('=== 用户已登录，准备提交申请 ===');
            console.log('当前Token:', token);
            console.log('用户ID:', userId);
            console.log('localStorage中的所有数据:', allLocalStorageData);
            
            // 先提交到数据库，等待成功响应
            console.log('BecomeGuidePage: 开始提交申请到数据库...');
            
            // 显示加载状态
            const loadingMessage = '正在提交申请，请稍候...';
            console.log(loadingMessage);
            
            const result = await submitToDatabase(data);
            console.log('🎊 申请数据已成功写入数据库!');
            console.log('🎊 数据库返回结果:', result);
            console.log('🎊 数据库返回结果类型:', typeof result);
            console.log('🎊 数据库返回结果键:', Object.keys(result));
            console.log('🎊 数据库返回结果详情:', JSON.stringify(result, null, 2));
            
            // 只有在数据库提交成功后才清除localStorage
            console.log('🧹 数据库提交成功，现在清除localStorage');
            clearLocalStorage();
            
            // 显示成功消息并跳转
            alert('申请提交成功！请登录主项目查看状态。');
            window.location.href = '/';
          } else {
            // 未登录，不清除localStorage，跳转到登录页面
            console.log('用户未登录，跳转到登录页面');
            alert('请先登录后再提交申请');
            window.location.href = '/login?redirect=/become-guide';
          }
        } catch (error) {
          console.error('💥 BecomeGuidePage: 提交失败:', error);
          console.error('💥 错误类型:', typeof error);
          console.error('💥 错误名称:', error instanceof Error ? error.name : 'Unknown');
          console.error('💥 错误消息:', error instanceof Error ? error.message : String(error));
          console.error('💥 错误堆栈:', error instanceof Error ? error.stack : 'No stack trace');
          console.error('💥 完整错误对象:', error);
          console.error('💥 当前localStorage数据:', getAllLocalStorageData());
          
          // 提交失败时不清除localStorage，保留用户数据
          const errorMessage = error instanceof Error ? error.message : '请重试';
          alert(`提交失败: ${errorMessage}`);
        }
      },
      onError: (error: any) => {
        console.warn('表单操作出现问题:', error);
        alert('操作失败，请重试');
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

  // 简化的资质上传组件
  const QualificationUploader = ({ onChange }: { onChange: (data: any) => void }) => {
    const [files, setFiles] = React.useState<File[]>([]);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files || []);
      setFiles(selectedFiles);
      onChange({ certifications: selectedFiles.reduce((acc: any, file: File, index: number) => {
        acc[`file_${index}`] = {
          name: file.name,
          type: file.type,
          size: file.size,
          description: '',
          visible: true
        };
        return acc;
      }, {} as any) });
    };

    return (
      <div className="space-y-4">
        <div>
          <label htmlFor="qualification-files" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">资质文件上传</label>
          <Input
            id="qualification-files"
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="mt-2"
          />
        </div>
        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">已选择的文件:</p>
            {files.map((file: File, index: number) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <span className="text-sm">{file.name}</span>
                <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
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

  // 目标群体数据
  const targetGroups = [
    { value: 'individual', label: '个人旅客' },
    { value: 'couple', label: '情侣/夫妇' },
    { value: 'family', label: '家庭' },
    { value: 'group', label: '团体' },
    { value: 'child', label: '亲子' },
    { value: 'elderly', label: '老年人' },
    { value: 'business', label: '商务客户' }
  ];

  // 检查是否有localStorage中的申请数据
  React.useEffect(() => {
    console.log('BecomeGuidePage: 组件挂载，开始检查localStorage状态');
    console.log('当前域名:', window.location.hostname);
    console.log('当前协议:', window.location.protocol);
    
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
    
    // 测试服务类别API端点
    const testServiceCategoriesAPI = async () => {
      try {
        console.log('BecomeGuidePage: 测试服务类别API端点...');
        const response = await fetch('/api/v2/service-categories/with-subcategories');
        if (response.ok) {
          const data = await response.json();
          console.log('BecomeGuidePage: 服务类别API响应成功:', data);
        } else {
          console.error('BecomeGuidePage: 服务类别API响应失败:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('BecomeGuidePage: 服务类别API请求失败:', error);
      }
    };
    
    testServiceCategoriesAPI();
    
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
                <h1 className="text-3xl font-bold">成为YaoTu地陪</h1>
                <p className="text-yellow-100 mt-2">分享您的当地专业知识，通过引导旅行者了解您的城市来赚钱</p>
              </div>
              <button
                onClick={() => window.location.href = '/'}
                className="text-white/80 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto p-6">
          {/* PDF功能按钮 */}
          {formData && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800">PDF功能</h3>
                  <p className="text-sm text-yellow-700">您可以预览和下载申请表的PDF版本</p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={handleShowPDFPreview}
                    variant="outline"
                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                  >
                    预览PDF
                  </Button>
                  <Button
                    onClick={handleDownloadPDF}
                    disabled={isProcessing}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    {isProcessing ? "生成中..." : "下载PDF"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <GuideForm
            config={config}
            ui={uiComponents}
            cities={cities}
            targetGroups={targetGroups}
            onLoadServiceCategories={loadServiceCategories}
            customTitle="成为我们的地陪"
            customDescription="加入我们，分享你的当地知识，帮助旅行者发现真正的日本。"
            showProgressBar={true}
            onLoadLocalStorage={loadFromLocalStorage}
            onSaveLocalStorage={saveToLocalStorage}
            onClearLocalStorage={clearLocalStorage}
          />
        </div>

        {/* PDF预览模态框 */}
        {showPDFPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">申请表预览</h2>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleDownloadPDF}
                    disabled={isProcessing}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    {isProcessing ? "生成中..." : "下载PDF"}
                  </Button>
                  <Button
                    onClick={handleClosePDFPreview}
                    variant="outline"
                  >
                    关闭
                  </Button>
                </div>
              </div>
              
              {/* 打印预览内容 */}
              <div id="print-root" className="p-8 bg-white">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">向导申请表</h1>
                  
                  {formData && (
                    <div className="space-y-6">
                      {/* 基本信息 */}
                      <div className="border-b pb-4">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">基本信息</h2>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <strong className="text-gray-600">姓名:</strong> 
                            <span className="ml-2">{formData.name || formData.fullName || "未填写"}</span>
                          </div>
                          <div>
                            <strong className="text-gray-600">性别:</strong> 
                            <span className="ml-2">{formData.sex || "未填写"}</span>
                          </div>
                          <div>
                            <strong className="text-gray-600">年龄:</strong> 
                            <span className="ml-2">{formData.age || "未填写"}</span>
                          </div>
                          <div>
                            <strong className="text-gray-600">MBTI:</strong> 
                            <span className="ml-2">{formData.mbti || "未填写"}</span>
                          </div>
                        </div>
                      </div>

                      {/* 服务信息 */}
                      <div className="border-b pb-4">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">服务信息</h2>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <strong className="text-gray-600">服务城市:</strong> 
                            <span className="ml-2">{formData.serviceCity || formData.city || "未填写"}</span>
                          </div>
                          <div>
                            <strong className="text-gray-600">职业:</strong> 
                            <span className="ml-2">{formData.occupation || formData.job || "未填写"}</span>
                          </div>
                          <div>
                            <strong className="text-gray-600">居住信息:</strong> 
                            <span className="ml-2">{formData.residenceInfo || formData.residence || "未填写"}</span>
                          </div>
                          <div>
                            <strong className="text-gray-600">居住开始日期:</strong> 
                            <span className="ml-2">{formData.residenceStartDate || formData.residenceStart || "未填写"}</span>
                          </div>
                        </div>
                      </div>

                      {/* 自我描述 */}
                      {formData.bio && (
                        <div className="border-b pb-4">
                          <h2 className="text-xl font-semibold mb-4 text-gray-700">自我描述</h2>
                          <p className="text-gray-700">{formData.bio || formData.description || "未填写"}</p>
                        </div>
                      )}

                      {/* 经验信息 */}
                      <div className="border-b pb-4">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">相关经验</h2>
                        <div className="space-y-2">
                          <div>
                            <strong className="text-gray-600">经验时长:</strong> 
                            <span className="ml-2">{formData.experienceDuration || formData.experience || "未填写"}</span>
                          </div>
                          <div>
                            <strong className="text-gray-600">服务场次:</strong> 
                            <span className="ml-2">{formData.experienceSession || formData.sessions || "未填写"}</span>
                          </div>
                        </div>
                      </div>

                      {/* 价格设置 */}
                      <div className="border-b pb-4">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">价格设置</h2>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <strong className="text-gray-600">基础价格:</strong> 
                            <span className="ml-2">{formData.basePrice || formData.hourlyRate || "未设置"}</span>
                          </div>
                          <div>
                            <strong className="text-gray-600">服务人数:</strong> 
                            <span className="ml-2">{formData.minPeople || 1} - {formData.maxPeople || 10} 人</span>
                          </div>
                          <div>
                            <strong className="text-gray-600">服务时长:</strong> 
                            <span className="ml-2">{formData.minDuration || 1} - {formData.maxDuration || 8} 小时</span>
                          </div>
                        </div>
                      </div>

                      {/* 申请时间 */}
                      <div className="pt-4">
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>申请日期: {new Date().toLocaleDateString("zh-CN")}</span>
                          <span>申请ID: {applicationId || "draft"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 隐藏的打印根元素 */}
        <div id="print-root" className="hidden print:block">
          {/* 这里的内容会在PDF生成时使用 */}
        </div>
      </motion.div>
    </div>
  );
};

export default BecomeGuidePage;

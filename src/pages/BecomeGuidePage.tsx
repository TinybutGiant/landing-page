import React from 'react';
import { motion } from 'framer-motion';
import { GuideForm, GuideFormConfig, UIComponents } from '@replit/guide-form';
import { usePDFGeneration, generatePDFBlob } from '@replit/guide-form';
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
      const response = await fetch('/api/v2/guide-applications/test');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ 代理连接正常:', data);
        return true;
      } else {
        console.error('❌ 代理连接失败:', response.status, response.statusText);
        return false;
      }
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
    
    return {
      ...qualifications,
      certifications: uploadedCertifications
    };
  };

  // 上传PDF到R2并获取URL
  const uploadPDFToR2 = async (formData: any, applicationId: number) => {
    try {
      const token = localStorage.getItem("yaotu_token");
      const userId = localStorage.getItem("yaotu_user_id");
      
      if (!token || !userId) {
        throw new Error('用户未登录');
      }
      
      console.log('📄 开始生成并上传PDF到R2...');
      
      // 生成PDF Blob
      const pdfBlob = await generatePDFBlob("preview-content", {
        filename: `guide-application-${applicationId}-${Date.now()}.pdf`
      });
      
      // 使用主项目的PDF上传API（相对路径，vite代理处理）
      const pdfArrayBuffer = await pdfBlob.arrayBuffer();
      
      const uploadResponse = await fetch(`/api/v2/guide-applications/${applicationId}/archive-pdf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/pdf',
          'Content-Length': pdfArrayBuffer.byteLength.toString(),
        },
        body: pdfArrayBuffer
      });
      
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('PDF上传失败:', uploadResponse.status, errorText);
        throw new Error(`PDF上传失败: ${uploadResponse.status} - ${errorText}`);
      }
      
      const uploadResult = await uploadResponse.json();
      console.log('✅ PDF上传成功，文件URL:', uploadResult.publicUrl);
      return uploadResult.publicUrl;
    } catch (error) {
      console.error('❌ PDF上传失败:', error);
      throw error;
    }
  };

  // 数据库提交申请 - 实现三个步骤的完整流程
  const submitToDatabase = async (data: any) => {
    try {
      const token = localStorage.getItem("yaotu_token");
      
      console.log('=== 🚀 开始申请提交流程 ===');
      console.log('📡 API端点:', `/api/v2/guide-applications`);
      console.log('🔑 认证Token:', token ? `${token.substring(0, 20)}...` : '未找到Token');
      
      // 提取实际的表单数据
      const formData = data.data || data;
      console.log('🔍 表单数据:', formData);
      
      // ========== 步骤1: 上传资质文件，更新guideApplicationData ==========
      console.log('📁 步骤1: 开始处理资质文件上传...');
      let processedQualifications = formData.qualifications || {};
      
      if (processedQualifications && Object.keys(processedQualifications).length > 0) {
        try {
          processedQualifications = await uploadQualificationFiles(processedQualifications);
          console.log('✅ 步骤1完成: 资质文件上传成功');
        } catch (error) {
          console.error('❌ 步骤1失败: 资质文件上传失败', error);
          throw new Error(`资质文件上传失败: ${error instanceof Error ? error.message : String(error)}`);
        }
      } else {
        console.log('ℹ️ 步骤1跳过: 无资质文件需要上传');
      }
      
      // ========== 步骤2: 写入数据库 ==========
      console.log('💾 步骤2: 开始写入数据库...');
      
      // 构建最终发送给API的数据
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
        basicPricePerHourCents: formData.basicPricePerHourCents || (formData.basePrice || formData.hourlyRate || 0) * 100,
        additionalPricePerPersonCents: formData.additionalPricePerPersonCents || 0,
        currency: formData.currency || 'JPY',
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
        // 使用处理后的资质信息
        qualifications: processedQualifications,
        // 转换其他可选字段
        age: formData.age || null,
        mbti: formData.mbti || null,
        socialProfile: formData.socialProfile || formData.socialMedia || '',
        // 设置申请状态
        applicationStatus: 'pending'
      };
      
      // 先检查用户是否真的有申请
      console.log('🔍 检查用户是否已有申请...');
      try {
        if (!token) {
          throw new Error('用户未登录');
        }
        
        const checkResponse = await fetch('/api/v2/guide-applications/my-application', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (checkResponse.ok) {
          const existingApp = await checkResponse.json();
          console.log('⚠️ 发现用户已有申请:', existingApp);
          throw new Error('用户已有申请，请更新现有申请而不是创建新申请');
        } else if (checkResponse.status === 404) {
          console.log('✅ 用户没有现有申请，可以创建新申请');
        } else {
          console.log('⚠️ 检查申请状态时出现错误:', checkResponse.status);
        }
      } catch (error) {
        console.log('⚠️ 检查申请状态失败:', error);
        // 继续执行，让后端API处理
      }

      console.log('🌐 发送HTTP请求到数据库API...');
      console.log('🌐 请求URL:', '/api/v2/guide-applications');
      console.log('🌐 请求方法: POST');
      console.log('🌐 请求头:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token ? token.substring(0, 20) + '...' : 'null'}`
      });
      
      const response = await fetch('/api/v2/guide-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalData)
      });

      console.log('📡 HTTP响应状态:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ 步骤2失败: 数据库写入失败', response.status, errorText);
        
        // 特殊处理401认证错误
        if (response.status === 401) {
          throw new Error(`401: 认证失败，请重新登录`);
        }
        
        throw new Error(`数据库写入失败: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ 步骤2完成: 数据库写入成功');
      console.log('🎉 申请ID:', result.id || result.applicationId);
      
      // ========== 步骤3: 上传PDF，并更新对应的application的internal tags ==========
      console.log('📄 步骤3: 开始生成并上传PDF...');
      try {
        const applicationId = result.id || result.applicationId;
        if (applicationId) {
          await uploadPDFToR2(formData, applicationId);
          console.log('✅ 步骤3完成: PDF上传成功，internal tags已更新');
        } else {
          console.warn('⚠️ 步骤3跳过: 未找到申请ID');
        }
      } catch (error) {
        console.error('❌ 步骤3失败: PDF上传失败', error);
        // PDF上传失败不影响申请提交，但记录错误
        console.warn('⚠️ PDF上传失败，但申请已成功提交到数据库');
      }
      
      console.log('🎊 申请提交流程全部完成!');
      return result;
    } catch (error) {
      console.error('💥 申请提交流程失败:', error);
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
            
            console.log('=== 用户已登录，申请提交成功 ===');
            console.log('当前Token:', token);
            console.log('用户ID:', userId);
            console.log('localStorage中的所有数据:', allLocalStorageData);
            console.log('🎊 申请数据已成功写入数据库!');
            console.log('🎊 提交的数据:', data);
            
            // 只有在数据库提交成功后才清除localStorage
            console.log('🧹 数据库提交成功，现在清除localStorage');
            clearLocalStorage();
            // 清除资质文件缓存
            localStorage.removeItem('yaotu_qualification_files');
            
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
            alert('登录已过期，请重新登录');
            window.location.href = '/login?redirect=/become-guide';
            return;
          }
          
          // 处理失败时不清除localStorage，保留用户数据
          const errorMessage = error instanceof Error ? error.message : '请重试';
          alert(`处理失败: ${errorMessage}`);
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
          const uploadResponse = await fetch('/api/v2/guide-applications/qualification-upload', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });
          
          if (!uploadResponse.ok) {
            throw new Error(`上传失败: ${uploadResponse.status}`);
          }
          
          const result = await uploadResponse.json();
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
            资质文件上传
            <span className="text-xs text-gray-500 ml-2">(支持图片、PDF，最大10MB)</span>
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
            <p className="text-sm text-gray-600">已选择的文件:</p>
            {uploadedFiles.map((file: any, index: number) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded border">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    {file.uploaded && (
                      <span className="text-xs text-green-600">✓ 已上传</span>
                    )}
                  </div>
                  <Input
                    placeholder="文件描述（可选）"
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
    
    // 测试代理连接
    const testConnections = async () => {
      console.log('🧪 开始测试连接...');
      
      // 测试代理连接
      const proxyOk = await testProxyConnection();
      
      // 测试服务类别API端点
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


        {/* 隐藏的打印根元素 */}
        <div id="print-root" className="hidden print:block">
          {/* 这里的内容会在PDF生成时使用 */}
        </div>
      </motion.div>
    </div>
  );
};

export default BecomeGuidePage;

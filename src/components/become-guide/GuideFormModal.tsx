import React from 'react';
import { motion } from 'framer-motion';
import { GuideForm, GuideFormConfig, UIComponents } from '@replit/guide-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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

interface GuideFormModalProps {
  onClose: () => void;
}

const GuideFormModal: React.FC<GuideFormModalProps> = ({ onClose }) => {
  // 配置表单 - 直接提交到主项目 API
  const config: GuideFormConfig = {
    apiEndpoints: {
      saveDraft: 'https://your-main-project-domain.com/api/v2/guide-applications/draft',
      submitApplication: 'https://your-main-project-domain.com/api/v2/guide-applications'
    },
    auth: {
      getToken: () => null, // 不需要认证
      getUserId: () => null // 不需要认证
    },
    callbacks: {
      onSuccess: (data) => {
        // 成功后跳转到主项目
        alert('申请提交成功！请登录主项目查看状态。');
        window.location.href = 'https://your-main-project-domain.com/login?redirect=/become-guide';
      },
      onError: (error) => {
        console.error('提交失败:', error);
        alert('提交失败，请重试');
      },
      onSaveDraft: (data) => {
        console.log('草稿已保存');
        alert('草稿已保存，请登录主项目继续填写。');
      }
    }
  };

  // 使用现有的 UI 组件
  const uiComponents: UIComponents = {
    // 基础表单组件
    Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    FormField: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    FormItem: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    FormLabel: ({ children, ...props }: any) => <label {...props}>{children}</label>,
    FormControl: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    FormMessage: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-t-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">成为YaoTu地陪</h2>
              <p className="text-yellow-100">分享您的当地专业知识，通过引导旅行者了解您的城市来赚钱</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <GuideForm
            config={config}
            ui={uiComponents}
            cities={cities}
            targetGroups={targetGroups}
            customTitle="成为我们的地陪"
            customDescription="加入我们，分享你的当地知识，帮助旅行者发现真正的日本。"
            showProgressBar={true}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GuideFormModal;

import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useIntl } from 'react-intl';
import { useLanguage } from '@/i18n/LanguageProvider';
import { authApi } from '@/lib/apiClient';
import { getMarketplaceUrl } from '@/lib/yaotuAuthRuntime';
import { 
  ApplicationStatus,
  ApprovalTimeline,
  SupplementalMaterialsUpload 
} from "@replit/guide-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "../components/ui/label";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Download, 
  Upload, 
  FileText, 
  History 
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";
import { isAuthenticated } from "../lib/auth";
import { 
  checkAndGenerateGuideForUser, 
  triggerLazyEvaluationForApprovedApplication,
  getUserGuideStatus 
} from "../lib/guideGenerationService";

interface ApplicationDetails {
  id: string;
  applicationStatus: "drafted" | "pending" | "needs_more_info" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  internalTags: string[];
  notes?: string;
}

interface ApprovalTimelineEntry {
  id: string | number;
  type: 'application_submitted' | 'admin_action' | 'user_response';
  timestamp: string;
  adminAction?: 'review' | 'approve' | 'reject' | 'require_more_info' | null;
  note?: string | null;
  userResponse?: any | null;
  adminName?: string;
}

export default function ViewApplicationStatusPage() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [lazyEvaluationTriggered, setLazyEvaluationTriggered] = useState(false);
  const intl = useIntl();
  const { locale } = useLanguage();
  
  // 检查是否是提交后跳转过来的
  const isJustSubmitted = new URLSearchParams(location.split('?')[1]).get('submitted') === 'true';
  const isUserAuthenticated = isAuthenticated();

  // 认证检查
  useEffect(() => {
    if (!isUserAuthenticated) {
      console.log('用户未认证，重定向到登录页面');
      setLocation('/login?redirect=/view-application-status');
    }
  }, [isUserAuthenticated, setLocation]);

  // 如果用户未认证，显示加载状态
  // Fetch application details
  const { data: application, isLoading, error } = useQuery<ApplicationDetails>({
    queryKey: ['/api/v2/guide-applications/my-application'],
    queryFn: () => apiRequest("GET", "/api/v2/guide-applications/my-application"),
    enabled: isUserAuthenticated && !!localStorage.getItem('yaotu_token'),
  });

  // 获取完整申请数据
  const { data: fullApplication } = useQuery({
    queryKey: [`/api/v2/guide-applications/${application?.id}`],
    queryFn: () => apiRequest("GET", `/api/v2/guide-applications/${application?.id}`),
    enabled: !!application?.id,
  });

  // 获取审批历史
  const { data: timelineData, isLoading: timelineLoading, refetch: refetchTimeline } = useQuery<{ timeline: ApprovalTimelineEntry[] }>({
    queryKey: [`/api/v2/guide-application-approvals-v2/timeline/${application?.id}`],
    queryFn: () => apiRequest("GET", `/api/v2/guide-application-approvals-v2/timeline/${application?.id}`),
    enabled: isUserAuthenticated && !!application?.id && !!localStorage.getItem('yaotu_token'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // Lazy evaluation for approved applications
  useEffect(() => {
    const triggerLazyEvaluation = async () => {
      if (!application || !isUserAuthenticated || lazyEvaluationTriggered) {
        return;
      }

      // Only trigger for approved applications
      if (application.applicationStatus === 'approved') {
        console.log('[LANDING_PAGE] 🚀 Application is approved, checking user guide status...');
        setLazyEvaluationTriggered(true);

        try {
          // Get user ID from token
          const token = localStorage.getItem('yaotu_token');
          if (!token) return;

          // Decode token to get user ID (assuming JWT format)
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.id || payload.userId;

          if (!userId) {
            console.error('[LANDING_PAGE] No user ID found in token');
            return;
          }

          // First check if user is already a guide
          console.log(`[LANDING_PAGE] Checking user guide status for user ${userId}`);
          const userStatus = await getUserGuideStatus(userId);
          
          if (userStatus.isGuide) {
            console.log('[LANDING_PAGE] ✅ User is already a guide, skipping lazy evaluation');
            return;
          }

          console.log(`[LANDING_PAGE] User is not a guide yet, triggering lazy evaluation for application ${application.id}`);
          
          // Trigger lazy evaluation
          const result = await triggerLazyEvaluationForApprovedApplication(application.id, userId);
          
          if (result.success) {
            console.log('[LANDING_PAGE] ✅ Lazy evaluation successful:', result.message);
            toast({
              title: intl.formatMessage({ id: 'viewApplicationStatus.congratulations' }),
              description: intl.formatMessage({ id: 'viewApplicationStatus.guideProfileGenerated' }),
            });
          } else {
            console.log('[LANDING_PAGE] ⚠️ Lazy evaluation result:', result.message);
            // Don't show error toast for expected cases like "already a guide"
            if (!result.message.includes('already') && !result.message.includes('already has')) {
              toast({
                title: intl.formatMessage({ id: 'viewApplicationStatus.processing' }),
                description: intl.formatMessage({ id: 'viewApplicationStatus.generatingGuideProfile' }),
                variant: "default"
              });
            }
          }
        } catch (error) {
          console.error('[LANDING_PAGE] Error triggering lazy evaluation:', error);
          // Don't show error toast to avoid confusing the user
        }
      }
    };

    triggerLazyEvaluation();
  }, [application, intl, isUserAuthenticated, lazyEvaluationTriggered, toast]);

  // 文件上传处理
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      return await authApi.upload('/api/v2/guide-applications/supplemental-material-upload', formData);
    } catch (error) {
      throw new Error(intl.formatMessage({ id: 'viewApplicationStatus.fileUploadFailed' }));
    }
  };

  // 提交补充材料
  const handleSubmitSupplemental = async (data: any) => {
    await apiRequest("POST", `/api/v2/guide-application-approvals-v2/submit-supplemental-materials`, data);
  };

  // Toast通知
  const handleToast = (options: { title: string; description?: string; variant?: string }) => {
    toast({
      ...options,
      variant: options.variant as "default" | "destructive" | undefined
    });
  };

  // 下载PDF
  const handleDownloadPDF = async () => {
    try {
      if (!application) return;
      
      const pdfTag = application.internalTags?.find(tag => tag.startsWith('pdf:'));
      if (pdfTag) {
        const pdfUrl = pdfTag.replace('pdf:', '');
        console.log('打开PDF URL:', pdfUrl);
        
        // 在新窗口打开PDF
        const newWindow = window.open(pdfUrl, '_blank');
        if (newWindow) {
          toast({
            title: intl.formatMessage({ id: 'viewApplicationStatus.pdfOpened' }),
            description: intl.formatMessage({ id: 'viewApplicationStatus.pdfOpenedInNewWindow' }),
          });
        } else {
          // 如果弹窗被阻止，尝试直接下载
          const link = document.createElement('a');
          link.href = pdfUrl;
          link.download = `guide-application-${application.id}.pdf`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          toast({
            title: intl.formatMessage({ id: 'viewApplicationStatus.pdfDownloadStarted' }),
            description: intl.formatMessage({ id: 'viewApplicationStatus.pdfDownloadStartedDescription' }),
          });
        }
      } else {
        toast({
          title: intl.formatMessage({ id: 'viewApplicationStatus.pdfNotAvailable' }),
          description: intl.formatMessage({ id: 'viewApplicationStatus.pdfGenerating' }),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('下载PDF失败:', error);
      toast({
        title: intl.formatMessage({ id: 'viewApplicationStatus.downloadFailed' }),
        description: intl.formatMessage({ id: 'viewApplicationStatus.pdfDownloadFailed' }),
        variant: "destructive",
      });
    }
  };

  // 导航处理
  const handleNavigateToGuide = () => {
    // Redirect to main project's guide dashboard
    window.location.href = getMarketplaceUrl('/guide-dashboard');
  };

  const handleNavigateToBecomeGuide = () => {
    window.location.href = "/become-guide";
  };

  if (!isUserAuthenticated) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{intl.formatMessage({ id: 'viewApplicationStatus.verifyingIdentity' })}</p>
        </div>
      </div>
    );
  }

  return (
    <ApplicationStatus
      application={application}
      fullApplication={fullApplication}
      timelineData={timelineData}
      isLoading={isLoading}
      error={error}
      timelineLoading={timelineLoading}
      isJustSubmitted={isJustSubmitted}
      onRefetchTimeline={refetchTimeline}
      onDownloadPDF={handleDownloadPDF}
      onNavigateToGuide={handleNavigateToGuide}
      onNavigateToBecomeGuide={handleNavigateToBecomeGuide}
      onFileUpload={handleFileUpload}
      onSubmitSupplemental={handleSubmitSupplemental}
      onToast={handleToast}
      Card={Card}
      CardContent={CardContent}
      CardHeader={CardHeader}
      CardTitle={CardTitle}
      Button={Button}
      Badge={Badge}
      Textarea={Textarea}
      Input={Input}
      Label={Label}
      CheckCircle={CheckCircle}
      Clock={Clock}
      AlertCircle={AlertCircle}
      XCircle={XCircle}
      Download={Download}
      Upload={Upload}
      FileText={FileText}
      History={History}
    />
  );
}

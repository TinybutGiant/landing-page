import { useEffect, useState } from "react";
import { ApprovalTimeline } from "./ApprovalTimeline";
import { SupplementalMaterialsUpload } from "./SupplementalMaterialsUpload";

interface ApplicationDetails {
  id: string;
  applicationStatus: "drafted" | "pending" | "needs_more_info" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  internalTags: string[];
  notes?: string; // Admin notes for additional materials needed
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

interface ApplicationStatusProps {
  // 数据相关
  application?: ApplicationDetails | null;
  fullApplication?: any;
  timelineData?: { timeline: ApprovalTimelineEntry[] };
  
  // 状态相关
  isLoading?: boolean;
  error?: any;
  timelineLoading?: boolean;
  isJustSubmitted?: boolean;
  
  // 回调函数
  onRefetchTimeline?: () => void;
  onDownloadPDF?: () => void;
  onNavigateToGuide?: () => void;
  onNavigateToBecomeGuide?: () => void;
  onFileUpload?: (file: File) => Promise<{ fileId: string; publicUrl: string }>;
  onSubmitSupplemental?: (data: any) => Promise<void>;
  onToast?: (options: { title: string; description?: string; variant?: string }) => void;
  
  // UI组件 - 通过props传入
  Card: any;
  CardContent: any;
  CardHeader: any;
  CardTitle: any;
  Button: any;
  Badge: any;
  Textarea: any;
  Input: any;
  Label: any;
  
  // 图标组件
  CheckCircle: any;
  Clock: any;
  AlertCircle: any;
  XCircle: any;
  Download: any;
  Upload: any;
  FileText: any;
  History: any;
}

export default function ApplicationStatus({
  application,
  fullApplication,
  timelineData,
  isLoading = false,
  error,
  timelineLoading = false,
  isJustSubmitted = false,
  onRefetchTimeline,
  onDownloadPDF,
  onNavigateToGuide,
  onNavigateToBecomeGuide,
  onFileUpload,
  onSubmitSupplemental,
  onToast,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Textarea,
  Input,
  Label,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Download,
  Upload,
  FileText,
  History,
}: ApplicationStatusProps) {
  // 检查是否需要显示补充材料上传
  const needsSupplementalMaterials = () => {
    if (!timelineData?.timeline || !application) return false;
    
    // 如果当前状态是 needs_more_info，显示上传功能
    if (application.applicationStatus === 'needs_more_info') {
      return true;
    }
    
    // 检查是否有最近的 require_more_info 动作且用户还没有回复
    const timeline = timelineData.timeline;
    const lastRequireMoreInfo = timeline
      .filter(entry => entry.type === 'admin_action' && entry.adminAction === 'require_more_info')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    if (!lastRequireMoreInfo) return false;
    
    // 检查在这个 require_more_info 之后是否有用户回复
    const hasUserResponseAfter = timeline.some(entry => 
      entry.type === 'user_response' && 
      new Date(entry.timestamp) > new Date(lastRequireMoreInfo.timestamp)
    );
    
    return !hasUserResponseAfter;
  };

  const handleSupplementalMaterialsSubmitted = () => {
    onRefetchTimeline?.();
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="h-6 w-6 text-yellow-500" />,
          text: "审核中",
          color: "bg-yellow-50 border-yellow-200 text-yellow-800",
          description: "您的申请正在审核中，我们会尽快处理。"
        };
      case "needs_more_info":
        return {
          icon: <AlertCircle className="h-6 w-6 text-orange-500" />,
          text: "需要补充材料",
          color: "bg-orange-50 border-orange-200 text-orange-800",
          description: "请按照要求补充相关材料。"
        };
      case "approved":
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-500" />,
          text: "申请通过",
          color: "bg-green-50 border-green-200 text-green-800",
          description: "恭喜！您的申请已通过，欢迎成为YaoTu地陪！"
        };
      case "rejected":
        return {
          icon: <XCircle className="h-6 w-6 text-red-500" />,
          text: "申请未通过",
          color: "bg-red-50 border-red-200 text-red-800",
          description: "很抱歉，您的申请未通过审核。"
        };
      default:
        return {
          icon: <Clock className="h-6 w-6 text-gray-500" />,
          text: "未知状态",
          color: "bg-gray-50 border-gray-200 text-gray-800",
          description: "申请状态未知。"
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-yellow-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-yellow-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">未找到申请记录</h2>
              <p className="text-gray-600 mb-6">
                您还没有提交地陪申请，请先完成申请表单。
              </p>
              <Button 
                onClick={onNavigateToBecomeGuide}
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                开始申请
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(application.applicationStatus);

  return (
    <div className="min-h-screen bg-yellow-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">申请状态</h1>
          <p className="text-gray-600">查看您的地陪申请进度和详情</p>
        </div>

        <div className="space-y-6">
          {/* 申请状态卡片 */}
          <Card className="rounded-2xl shadow-lg">
            <CardHeader className="bg-yellow-400 rounded-t-2xl">
              <CardTitle className="text-white flex items-center gap-3">
                {statusInfo.icon}
                申请状态
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className={`p-4 rounded-lg border ${statusInfo.color} mb-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{statusInfo.text}</h3>
                    <p className="mt-1">{statusInfo.description}</p>
                  </div>
                  <Badge variant="outline" className="ml-4">
                    申请ID: {application.id.substring(0, 8)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">提交时间：</span>
                  <span className="text-gray-600">
                    {new Date(application.createdAt).toLocaleString('zh-CN')}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">最后更新：</span>
                  <span className="text-gray-600">
                    {new Date(application.updatedAt).toLocaleString('zh-CN')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 审批历史卡片 */}
          {application.applicationStatus !== 'drafted' && (
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  审批历史
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {timelineLoading ? (
                  <div className="animate-pulse">
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : timelineData?.timeline ? (
                  <ApprovalTimeline 
                    timeline={timelineData.timeline}
                    CheckCircle={CheckCircle}
                    Clock={Clock}
                    AlertCircle={AlertCircle}
                    XCircle={XCircle}
                    FileCheck={FileText}
                    Upload={Upload}
                  />
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    暂无审批历史记录
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* 补充材料上传 */}
          {needsSupplementalMaterials() && application?.id && (
            <SupplementalMaterialsUpload 
              applicationId={application.id}
              onSubmitSuccess={handleSupplementalMaterialsSubmitted}
              Card={Card}
              CardContent={CardContent}
              CardHeader={CardHeader}
              CardTitle={CardTitle}
              Button={Button}
              Textarea={Textarea}
              Input={Input}
              Label={Label}
              Upload={Upload}
              FileText={FileText}
              X={XCircle}
              CheckCircle={CheckCircle}
              onFileUpload={onFileUpload}
              onSubmit={onSubmitSupplemental}
              onToast={onToast}
            />
          )}

          {/* PDF文档卡片 - 只在申请提交后显示 */}
          {application.applicationStatus !== 'drafted' && (
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  申请文档
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isJustSubmitted && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-green-800 font-medium">🎉 申请提交成功！</p>
                    <p className="text-green-700 text-sm mt-1">您可以点击下方按钮下载PDF并打印。</p>
                  </div>
                )}
                <p className="text-gray-600 mb-4">
                  您可以生成并下载完整的申请PDF文档，用于查看或打印。
                </p>
                
                <div className="flex justify-center">
                  <Button
                    onClick={onDownloadPDF}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    下载PDF申请文件
                  </Button>
                </div>
                <p className="text-center text-sm text-gray-500 mt-3">
                  您的申请PDF已自动生成并归档
                </p>
              </CardContent>
            </Card>
          )}

          {/* 补充材料卡片 */}
          {application.applicationStatus === "needs_more_info" && application.notes && (
            <Card className="rounded-2xl shadow-lg border-orange-200">
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  需要补充的材料
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <p className="text-orange-800 whitespace-pre-line">
                    {application.notes}
                  </p>
                </div>
                
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Upload className="h-4 w-4 mr-2" />
                  上传补充材料
                </Button>
              </CardContent>
            </Card>
          )}

          {/* 下一步指引 */}
          {application.applicationStatus === "approved" && (
            <Card className="rounded-2xl shadow-lg border-green-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">申请已通过!</h3>
                  <p className="text-green-700 mb-6">
                    恭喜您成功成为YaoTu地陪！现在您可以创建自己的服务项目，开始接待客户了。
                  </p>
                  <Button 
                    onClick={onNavigateToGuide}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    前往地陪控制台
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
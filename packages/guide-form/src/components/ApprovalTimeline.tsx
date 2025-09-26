interface ApprovalTimelineEntry {
  id: string | number;
  type: 'application_submitted' | 'admin_action' | 'user_response';
  timestamp: string;
  adminAction?: 'review' | 'approve' | 'reject' | 'require_more_info' | null;
  note?: string | null;
  userResponse?: any | null;
  adminName?: string;
}

interface ApprovalTimelineProps {
  timeline: ApprovalTimelineEntry[];
  CheckCircle: any;
  Clock: any;
  AlertCircle: any;
  XCircle: any;
  FileCheck: any;
  Upload: any;
}

export function ApprovalTimeline({ 
  timeline, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle, 
  FileCheck, 
  Upload 
}: ApprovalTimelineProps) {
  const getTimelineItemInfo = (entry: ApprovalTimelineEntry) => {
    switch (entry.type) {
      case 'application_submitted':
        return {
          icon: <CheckCircle className="h-5 w-5 text-blue-500" />,
          title: "申请已提交",
          description: "您的地陪申请已成功提交，等待审核",
          color: "text-blue-600"
        };
      
      case 'admin_action':
        switch (entry.adminAction) {
          case 'review':
            return {
              icon: <Clock className="h-5 w-5 text-yellow-500" />,
              title: "当前申请正在审核中",
              description: entry.note || "管理员正在审核您的申请",
              color: "text-yellow-600"
            };
          case 'approve':
            return {
              icon: <CheckCircle className="h-5 w-5 text-green-500" />,
              title: "当前申请已审核通过",
              description: entry.note || "恭喜！您的申请已经通过审核",
              color: "text-green-600"
            };
          case 'reject':
            return {
              icon: <XCircle className="h-5 w-5 text-red-500" />,
              title: "当前申请已被拒绝",
              description: entry.note || "很抱歉，您的申请未通过审核",
              color: "text-red-600"
            };
          case 'require_more_info':
            return {
              icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
              title: "需要补充材料",
              description: entry.note || "请按要求补充相关材料",
              color: "text-orange-600"
            };
          default:
            return {
              icon: <Clock className="h-5 w-5 text-gray-500" />,
              title: "管理员操作",
              description: entry.note || "管理员已处理申请",
              color: "text-gray-600"
            };
        }
      
      case 'user_response':
        return {
          icon: <FileCheck className="h-5 w-5 text-blue-500" />,
          title: "补充材料已上传",
          description: "您已提交补充材料，等待重新审核",
          color: "text-blue-600"
        };
      
      default:
        return {
          icon: <Clock className="h-5 w-5 text-gray-500" />,
          title: "未知状态",
          description: "",
          color: "text-gray-600"
        };
    }
  };

  // 检查是否需要显示补充材料状态
  const getSupplementaryMaterialStatus = () => {
    // 找到最后一个 require_more_info 动作
    const lastRequireMoreInfo = timeline
      .filter(entry => entry.type === 'admin_action' && entry.adminAction === 'require_more_info')
      .pop();
    
    if (!lastRequireMoreInfo) return null;

    // 检查在这个动作之后是否有用户回复
    const lastRequireMoreInfoTime = new Date(lastRequireMoreInfo.timestamp).getTime();
    const hasUserResponseAfter = timeline.some(entry => 
      entry.type === 'user_response' && 
      new Date(entry.timestamp).getTime() > lastRequireMoreInfoTime
    );

    return {
      needsResponse: !hasUserResponseAfter,
      lastRequireMoreInfo
    };
  };

  const supplementaryStatus = getSupplementaryMaterialStatus();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">审批历史</h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {timeline.map((entry, index) => {
            const itemInfo = getTimelineItemInfo(entry);
            const isLast = index === timeline.length - 1;
            
            return (
              <div key={`${entry.type}-${entry.id}`} className="relative flex items-start">
                {/* Timeline dot */}
                <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-white border-2 border-gray-200 rounded-full">
                  {itemInfo.icon}
                </div>
                
                {/* Content */}
                <div className="ml-4 flex-1 min-w-0">
                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-medium ${itemInfo.color}`}>
                          {itemInfo.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {itemInfo.description}
                        </p>
                        {entry.adminName && (
                          <p className="text-xs text-gray-500 mt-1">
                            审核人员: {entry.adminName}
                          </p>
                        )}
                      </div>
                      <time className="text-xs text-gray-500 whitespace-nowrap ml-4">
                        {new Date(entry.timestamp).toLocaleString('zh-CN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* 显示补充材料状态 */}
          {supplementaryStatus?.needsResponse && (
            <div className="relative flex items-start">
              <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-white border-2 border-orange-200 rounded-full">
                <Upload className="h-5 w-5 text-orange-500" />
              </div>
              
              <div className="ml-4 flex-1 min-w-0">
                <div className="bg-orange-50 rounded-lg border border-orange-200 p-4 shadow-sm">
                  <h4 className="font-medium text-orange-600">
                    补充材料尚未上传
                  </h4>
                  <p className="text-sm text-orange-700 mt-1">
                    请根据管理员要求上传补充材料以继续审核流程
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

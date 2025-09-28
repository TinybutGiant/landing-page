import { useIntl } from 'react-intl';

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
  const intl = useIntl();
  const getTimelineItemInfo = (entry: ApprovalTimelineEntry) => {
    switch (entry.type) {
      case 'application_submitted':
        return {
          icon: <CheckCircle className="h-5 w-5 text-blue-500" />,
          title: intl.formatMessage({ id: 'approvalTimeline.applicationSubmitted' }),
          description: intl.formatMessage({ id: 'approvalTimeline.applicationSubmittedDescription' }),
          color: "text-blue-600"
        };
      
      case 'admin_action':
        switch (entry.adminAction) {
          case 'review':
            return {
              icon: <Clock className="h-5 w-5 text-yellow-500" />,
              title: intl.formatMessage({ id: 'approvalTimeline.underReview' }),
              description: entry.note || intl.formatMessage({ id: 'approvalTimeline.underReviewDescription' }),
              color: "text-yellow-600"
            };
          case 'approve':
            return {
              icon: <CheckCircle className="h-5 w-5 text-green-500" />,
              title: intl.formatMessage({ id: 'approvalTimeline.approved' }),
              description: entry.note || intl.formatMessage({ id: 'approvalTimeline.approvedDescription' }),
              color: "text-green-600"
            };
          case 'reject':
            return {
              icon: <XCircle className="h-5 w-5 text-red-500" />,
              title: intl.formatMessage({ id: 'approvalTimeline.rejected' }),
              description: entry.note || intl.formatMessage({ id: 'approvalTimeline.rejectedDescription' }),
              color: "text-red-600"
            };
          case 'require_more_info':
            return {
              icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
              title: intl.formatMessage({ id: 'approvalTimeline.requireMoreInfo' }),
              description: entry.note || intl.formatMessage({ id: 'approvalTimeline.requireMoreInfoDescription' }),
              color: "text-orange-600"
            };
          default:
            return {
              icon: <Clock className="h-5 w-5 text-gray-500" />,
              title: intl.formatMessage({ id: 'approvalTimeline.adminAction' }),
              description: entry.note || intl.formatMessage({ id: 'approvalTimeline.adminActionDescription' }),
              color: "text-gray-600"
            };
        }
      
      case 'user_response':
        return {
          icon: <FileCheck className="h-5 w-5 text-blue-500" />,
          title: intl.formatMessage({ id: 'approvalTimeline.supplementalMaterialsUploaded' }),
          description: intl.formatMessage({ id: 'approvalTimeline.supplementalMaterialsUploadedDescription' }),
          color: "text-blue-600"
        };
      
      default:
        return {
          icon: <Clock className="h-5 w-5 text-gray-500" />,
          title: intl.formatMessage({ id: 'approvalTimeline.unknownStatus' }),
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
      <h3 className="text-lg font-semibold text-gray-900">{intl.formatMessage({ id: 'approvalTimeline.title' })}</h3>
      
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
                            {intl.formatMessage({ id: 'approvalTimeline.reviewer' })}: {entry.adminName}
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
                    {intl.formatMessage({ id: 'approvalTimeline.supplementalMaterialsNotUploaded' })}
                  </h4>
                  <p className="text-sm text-orange-700 mt-1">
                    {intl.formatMessage({ id: 'approvalTimeline.supplementalMaterialsNotUploadedDescription' })}
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

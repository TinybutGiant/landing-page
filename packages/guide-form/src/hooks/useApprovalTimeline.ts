export interface ApprovalTimelineEntry {
  id: string | number;
  type: 'application_submitted' | 'admin_action' | 'user_response';
  timestamp: string;
  adminAction?: 'review' | 'approve' | 'reject' | 'require_more_info' | null;
  note?: string | null;
  userResponse?: any | null;
  adminName?: string;
}

// 这个hook现在只是一个类型定义，实际的数据获取逻辑需要在使用的项目中实现
export function useApprovalTimeline(applicationId: string | undefined) {
  // 这个函数现在返回一个占位符，实际实现需要在使用的项目中完成
  return {
    data: undefined,
    isLoading: false,
    error: null,
    refetch: () => {}
  };
}

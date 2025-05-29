// This file is intentionally left minimal as per the implementation guidelines.
// Real data should come from API endpoints, not mock data.

export interface MockDataConfig {
  useRealData: boolean;
}

export const mockConfig: MockDataConfig = {
  useRealData: true, // Always prefer real data from APIs
};

// Empty states and error messages for when real data is not available
export const emptyStates = {
  nodes: {
    title: "暂无网络节点",
    description: "点击添加节点按钮创建第一个网络节点",
  },
  alerts: {
    title: "暂无告警",
    description: "系统运行正常，所有服务状态良好",
  },
  sessions: {
    title: "暂无AI诊断记录",
    description: "开始与AI助手对话来获得网络诊断建议",
  },
  metrics: {
    title: "暂无性能数据",
    description: "等待系统收集性能指标数据",
  },
};

export const errorMessages = {
  network: "网络连接失败，请检查您的网络设置",
  unauthorized: "您没有权限访问此资源",
  server: "服务器错误，请稍后重试",
  validation: "输入数据格式不正确，请检查后重试",
  notFound: "请求的资源不存在",
  timeout: "请求超时，请稍后重试",
};

// Utility function to handle API errors consistently
export function getErrorMessage(error: any): string {
  if (error?.message) return error.message;
  if (error?.status === 401) return errorMessages.unauthorized;
  if (error?.status === 404) return errorMessages.notFound;
  if (error?.status >= 500) return errorMessages.server;
  if (error?.status === 400) return errorMessages.validation;
  return errorMessages.network;
}

// Loading states
export const loadingStates = {
  dashboard: "加载监控数据中...",
  nodes: "加载网络节点中...",
  alerts: "加载告警信息中...",
  ai: "AI正在分析中...",
  metrics: "加载性能指标中...",
};

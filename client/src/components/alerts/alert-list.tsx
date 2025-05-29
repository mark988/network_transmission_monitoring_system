import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, 
  Shield, 
  Info, 
  CheckCircle,
  Clock,
  User
} from "lucide-react";

interface Alert {
  id: string;
  title: string;
  description?: string;
  severity: "info" | "warning" | "critical";
  status: "active" | "acknowledged" | "resolved";
  nodeId?: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  createdAt: string;
}

interface AlertListProps {
  filter?: "active" | "acknowledged" | "resolved";
  limit?: number;
}

export function AlertList({ filter, limit }: AlertListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts, isLoading, error } = useQuery({
    queryKey: ["/api/alerts"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const acknowledgeAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      await apiRequest("PATCH", `/api/alerts/${alertId}/acknowledge`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "告警已确认",
        description: "告警已标记为已确认状态",
      });
    },
    onError: () => {
      toast({
        title: "操作失败",
        description: "确认告警时发生错误",
        variant: "destructive",
      });
    },
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <AlertTriangle className="w-4 h-4" />;
      case "warning": return <Shield className="w-4 h-4" />;
      case "info": return <Info className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-400 bg-red-500/20 border-red-500/30";
      case "warning": return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "info": return "text-blue-400 bg-blue-500/20 border-blue-500/30";
      default: return "text-slate-400 bg-slate-500/20 border-slate-500/30";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "critical": return "严重";
      case "warning": return "警告";
      case "info": return "信息";
      default: return severity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-red-400 bg-red-500/20 border-red-500/30";
      case "acknowledged": return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "resolved": return "text-green-400 bg-green-500/20 border-green-500/30";
      default: return "text-slate-400 bg-slate-500/20 border-slate-500/30";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "活跃";
      case "acknowledged": return "已确认";
      case "resolved": return "已解决";
      default: return status;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "刚刚";
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`;
    return `${Math.floor(diffInMinutes / 1440)}天前`;
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    acknowledgeAlertMutation.mutate(alertId);
  };

  // Filter alerts based on status and limit
  let filteredAlerts = alerts || [];
  if (filter) {
    filteredAlerts = filteredAlerts.filter((alert: Alert) => alert.status === filter);
  }
  if (limit) {
    filteredAlerts = filteredAlerts.slice(0, limit);
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-600">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-500/10 border-red-500/20">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <div className="text-red-400 mb-2">加载告警失败</div>
          <div className="text-slate-400 text-sm">请检查网络连接或稍后重试</div>
        </CardContent>
      </Card>
    );
  }

  if (filteredAlerts.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-600">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <div className="text-slate-400 mb-2">
            {filter === "active" ? "暂无活跃告警" :
             filter === "acknowledged" ? "暂无已确认告警" :
             filter === "resolved" ? "暂无已解决告警" :
             "暂无告警"}
          </div>
          <div className="text-slate-500 text-sm">
            系统运行正常，所有服务状态良好
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredAlerts.map((alert: Alert) => (
        <Card 
          key={alert.id} 
          className={`border-l-4 ${
            alert.severity === 'critical' ? 'border-l-red-500 bg-red-500/5' :
            alert.severity === 'warning' ? 'border-l-yellow-500 bg-yellow-500/5' :
            'border-l-blue-500 bg-blue-500/5'
          } bg-slate-800/50 border-slate-600`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getSeverityColor(alert.severity)}`}>
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm">{alert.title}</h4>
                    {alert.description && (
                      <p className="text-slate-400 text-xs mt-1 line-clamp-2">{alert.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mt-3 ml-11">
                  <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                    {getSeverityLabel(alert.severity)}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(alert.status)}>
                    {getStatusLabel(alert.status)}
                  </Badge>
                  {alert.nodeId && (
                    <Badge variant="outline" className="bg-slate-600/50 text-slate-300 border-slate-500">
                      {alert.nodeId}
                    </Badge>
                  )}
                  <span className="text-slate-400 text-xs flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimeAgo(alert.createdAt)}
                  </span>
                </div>

                {alert.status === "acknowledged" && alert.acknowledgedBy && (
                  <div className="flex items-center space-x-2 mt-2 ml-11 text-xs text-slate-400">
                    <User className="w-3 h-3" />
                    <span>已由 {alert.acknowledgedBy} 确认</span>
                    {alert.acknowledgedAt && (
                      <span>• {formatTimeAgo(alert.acknowledgedAt)}</span>
                    )}
                  </div>
                )}

                {alert.status === "resolved" && alert.resolvedAt && (
                  <div className="flex items-center space-x-2 mt-2 ml-11 text-xs text-green-400">
                    <CheckCircle className="w-3 h-3" />
                    <span>已于 {formatTimeAgo(alert.resolvedAt)} 解决</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {alert.status === "active" && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-slate-700 border-slate-600 hover:bg-slate-600 text-xs"
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                      disabled={acknowledgeAlertMutation.isPending}
                    >
                      确认
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-slate-700 border-slate-600 hover:bg-slate-600 text-xs"
                    >
                      忽略
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 text-xs"
                    >
                      处理
                    </Button>
                  </>
                )}
                {alert.status === "acknowledged" && (
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 text-xs"
                  >
                    解决
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

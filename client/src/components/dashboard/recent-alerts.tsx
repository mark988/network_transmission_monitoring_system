import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Shield, Info, ExternalLink } from "lucide-react";

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
  node: string;
  time: string;
  status: "active" | "acknowledged" | "resolved";
}

export function RecentAlerts() {
  const { data: alerts } = useQuery({
    queryKey: ["/api/dashboard/alerts"],
    refetchInterval: 30000,
  });

  // Fallback data when API is not available
  const defaultAlerts: Alert[] = [
    {
      id: "1",
      title: "核心路由器CPU使用率过高",
      description: "Router-01 CPU使用率达到89%，超过警戒阈值85%",
      severity: "critical",
      node: "Router-01",
      time: "2分钟前",
      status: "active"
    },
    {
      id: "2",
      title: "网络延迟异常",
      description: "Edge-02 到核心节点延迟超过50ms",
      severity: "warning",
      node: "Edge-02", 
      time: "15分钟前",
      status: "active"
    },
    {
      id: "3",
      title: "系统维护完成",
      description: "Switch-01 固件升级已完成，系统运行正常",
      severity: "info",
      node: "Switch-01",
      time: "1小时前",
      status: "resolved"
    }
  ];

  const alertData = alerts || defaultAlerts;

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

  return (
    <Card className="glass-effect border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-lg font-semibold text-white">最近告警</CardTitle>
        <Link href="/alerts">
          <Button variant="link" className="text-blue-400 hover:text-blue-300 text-sm p-0">
            查看全部
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {alertData.slice(0, 4).map((alert) => (
          <div 
            key={alert.id} 
            className={`flex items-start space-x-4 p-4 rounded-lg border ${
              alert.severity === 'critical' ? 'bg-red-500/5 border-red-500/20' :
              alert.severity === 'warning' ? 'bg-yellow-500/5 border-yellow-500/20' :
              'bg-blue-500/5 border-blue-500/20'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getSeverityColor(alert.severity)}`}>
              {getSeverityIcon(alert.severity)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-white truncate">{alert.title}</p>
                <span className="text-xs text-slate-400 ml-2 whitespace-nowrap">{alert.time}</span>
              </div>
              <p className="text-xs text-slate-400 mb-2 line-clamp-2">{alert.description}</p>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getSeverityColor(alert.severity)}`}
                >
                  {getSeverityLabel(alert.severity)}
                </Badge>
                <Badge 
                  variant="outline" 
                  className="text-xs bg-slate-600/50 text-slate-300 border-slate-500"
                >
                  {alert.node}
                </Badge>
                {alert.status === 'resolved' && (
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-green-500/20 text-green-400 border-green-500/30"
                  >
                    已解决
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Shield, Info, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const { data: alerts } = useQuery({
    queryKey: ["/api/dashboard/alerts"],
    refetchInterval: 30000,
  });

  // Extended alert data for demonstration with multiple pages
  const extendedAlerts: Alert[] = [
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
    },
    {
      id: "4",
      title: "交换机端口流量异常",
      description: "Switch-05 端口 eth0/24 流量突增300%",
      severity: "warning",
      node: "Switch-05",
      time: "32分钟前",
      status: "acknowledged"
    },
    {
      id: "5",
      title: "光纤连接中断",
      description: "主干光纤F01信号丢失，正在切换备用链路",
      severity: "critical",
      node: "Fiber-01",
      time: "45分钟前",
      status: "active"
    },
    {
      id: "6",
      title: "防火墙规则更新",
      description: "安全策略已更新，新规则生效中",
      severity: "info",
      node: "Firewall-03",
      time: "1小时前",
      status: "resolved"
    },
    {
      id: "7",
      title: "服务器磁盘空间不足",
      description: "Server-12 磁盘使用率达到92%",
      severity: "warning",
      node: "Server-12",
      time: "2小时前",
      status: "active"
    },
    {
      id: "8",
      title: "网络设备重启完成",
      description: "Router-08 重启完成，服务已恢复",
      severity: "info",
      node: "Router-08",
      time: "3小时前",
      status: "resolved"
    },
    {
      id: "9",
      title: "带宽使用率过高",
      description: "WAN链路带宽使用率达到88%",
      severity: "warning",
      node: "WAN-Gateway",
      time: "4小时前",
      status: "acknowledged"
    },
    {
      id: "10",
      title: "DHCP池耗尽警告",
      description: "DHCP地址池可用IP不足10个",
      severity: "critical",
      node: "DHCP-Server",
      time: "5小时前",
      status: "active"
    }
  ];

  const alertData = (alerts as Alert[]) || extendedAlerts;

  // Pagination logic
  const totalItems = alertData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = alertData.slice(startIndex, endIndex);

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
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="text-blue-400 hover:text-blue-300 text-sm p-0">
              查看全部
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] bg-slate-800 border-slate-600 overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">所有告警信息</DialogTitle>
            </DialogHeader>
            
            <div className="overflow-y-auto max-h-[60vh] pr-4">
              <div className="space-y-4">
                {currentItems.map((alert) => (
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
                        <p className="text-sm font-medium text-white">{alert.title}</p>
                        <span className="text-xs text-slate-400 ml-2 whitespace-nowrap">{alert.time}</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{alert.description}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={`text-xs ${getSeverityColor(alert.severity)}`}>
                          {getSeverityLabel(alert.severity)}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-slate-600/50 text-slate-300 border-slate-500">
                          {alert.node}
                        </Badge>
                        {alert.status === 'resolved' && (
                          <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                            已解决
                          </Badge>
                        )}
                        {alert.status === 'acknowledged' && (
                          <Badge variant="outline" className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            已确认
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-600">
              <div className="text-sm text-slate-400">
                显示 {startIndex + 1}-{Math.min(endIndex, totalItems)} 条，共 {totalItems} 条
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="bg-slate-700 border-slate-600 hover:bg-slate-600 text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-slate-300">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="bg-slate-700 border-slate-600 hover:bg-slate-600 text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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

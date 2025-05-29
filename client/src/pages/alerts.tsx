import { useState } from "react";
import { Header } from "@/components/layout/header";
import { AlertList } from "@/components/alerts/alert-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  Search, 
  Download, 
  Settings, 
  AlertTriangle,
  Info,
  Shield,
  CheckCircle,
  Loader2
} from "lucide-react";

export default function Alerts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [processingAlerts, setProcessingAlerts] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const recentAlerts = [
    {
      id: "1",
      title: "核心路由器CPU使用率过高",
      description: "Router-01 CPU使用率达到89%，超过警戒阈值85%",
      severity: "critical",
      status: "active",
      node: "Router-01",
      time: "2分钟前",
      acknowledged: false
    },
    {
      id: "2", 
      title: "网络延迟异常",
      description: "Edge-02 到核心节点延迟超过50ms",
      severity: "warning",
      status: "active", 
      node: "Edge-02",
      time: "15分钟前",
      acknowledged: false
    },
    {
      id: "3",
      title: "交换机端口流量异常",
      description: "Switch-05 端口 eth0/24 流量突增300%",
      severity: "warning",
      status: "acknowledged",
      node: "Switch-05", 
      time: "32分钟前",
      acknowledged: true,
      acknowledgedBy: "管理员"
    },
    {
      id: "4",
      title: "系统维护完成",
      description: "Switch-01 固件升级已完成，系统运行正常",
      severity: "info",
      status: "resolved",
      node: "Switch-01",
      time: "1小时前",
      acknowledged: true,
      acknowledgedBy: "系统"
    }
  ];

  const [alerts, setAlerts] = useState(recentAlerts);

  // 事件处理函数
  const handleSeverityFilterChange = (value: string) => {
    setSeverityFilter(value);
    toast({
      title: "筛选已更新",
      description: `已切换到级别: ${value === 'all' ? '所有级别' : value === 'critical' ? '严重' : value === 'warning' ? '警告' : '信息'}`,
    });
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    toast({
      title: "筛选已更新", 
      description: `已切换到状态: ${value === 'all' ? '所有状态' : value === 'active' ? '活跃' : value === 'acknowledged' ? '已确认' : '已解决'}`,
    });
  };

  const handleExport = () => {
    toast({
      title: "导出开始",
      description: "正在生成告警数据报表，请稍候...",
    });
    
    // 模拟导出延迟
    setTimeout(() => {
      const csvContent = alerts.map(alert => 
        `${alert.title},${alert.severity},${alert.status},${alert.node},${alert.time}`
      ).join('\n');
      
      const blob = new Blob([`标题,级别,状态,节点,时间\n${csvContent}`], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `alerts_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "导出完成",
        description: "告警数据已成功导出到本地文件",
      });
    }, 1500);
  };

  const handleAlertConfig = () => {
    toast({
      title: "告警配置",
      description: "正在打开告警配置界面...",
    });
  };

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: "acknowledged", acknowledged: true, acknowledgedBy: "当前用户" }
          : alert
      )
    );
    
    toast({
      title: "告警已确认",
      description: "告警状态已更新为已确认",
    });
  };

  const handleIgnore = (alertId: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
    
    toast({
      title: "告警已忽略",
      description: "告警已从列表中移除",
    });
  };

  const handleProcess = async (alertId: string) => {
    setProcessingAlerts(prev => new Set(prev.add(alertId)));
    
    toast({
      title: "开始处理",
      description: "正在处理告警，请稍候...",
    });

    // 模拟处理延迟
    setTimeout(() => {
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: "resolved", acknowledged: true, acknowledgedBy: "系统自动处理" }
            : alert
        )
      );
      
      setProcessingAlerts(prev => {
        const newSet = new Set(prev);
        newSet.delete(alertId);
        return newSet;
      });
      
      toast({
        title: "处理完成",
        description: "告警已成功处理并解决",
      });
    }, 2000);
  };

  const alertStats = [
    { 
      label: "总告警数", 
      value: "23", 
      icon: <Bell className="w-5 h-5" />, 
      color: "text-blue-400",
      bgColor: "bg-blue-500/20" 
    },
    { 
      label: "严重告警", 
      value: "3", 
      icon: <AlertTriangle className="w-5 h-5" />, 
      color: "text-red-400",
      bgColor: "bg-red-500/20" 
    },
    { 
      label: "警告告警", 
      value: "12", 
      icon: <Shield className="w-5 h-5" />, 
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20" 
    },
    { 
      label: "已处理", 
      value: "8", 
      icon: <CheckCircle className="w-5 h-5" />, 
      color: "text-green-400",
      bgColor: "bg-green-500/20" 
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-400 bg-red-500/20 border-red-500/30";
      case "warning": return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "info": return "text-blue-400 bg-blue-500/20 border-blue-500/30";
      default: return "text-slate-400 bg-slate-500/20 border-slate-500/30";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <AlertTriangle className="w-4 h-4" />;
      case "warning": return <Shield className="w-4 h-4" />;
      case "info": return <Info className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="告警中心" />
      
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Alert Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {alertStats.map((stat, index) => (
            <Card key={index} className="glass-effect border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <div className={stat.color}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Card className="glass-effect border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">告警管理</CardTitle>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="搜索告警内容..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400 w-64"
                  />
                </div>
                <Select value={severityFilter} onValueChange={handleSeverityFilterChange}>
                  <SelectTrigger className="w-32 bg-slate-700 border-slate-600">
                    <SelectValue placeholder="级别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有级别</SelectItem>
                    <SelectItem value="critical">严重</SelectItem>
                    <SelectItem value="warning">警告</SelectItem>
                    <SelectItem value="info">信息</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                  <SelectTrigger className="w-32 bg-slate-700 border-slate-600">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有状态</SelectItem>
                    <SelectItem value="active">活跃</SelectItem>
                    <SelectItem value="acknowledged">已确认</SelectItem>
                    <SelectItem value="resolved">已解决</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                  onClick={handleExport}
                >
                  <Download className="w-4 h-4 mr-2" />
                  导出
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                  onClick={handleAlertConfig}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  告警配置
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-700">
                <TabsTrigger value="active" className="data-[state=active]:bg-blue-600">
                  活跃告警
                  <Badge className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5">15</Badge>
                </TabsTrigger>
                <TabsTrigger value="acknowledged" className="data-[state=active]:bg-blue-600">
                  已确认
                  <Badge className="ml-2 bg-yellow-500 text-white text-xs px-1.5 py-0.5">5</Badge>
                </TabsTrigger>
                <TabsTrigger value="resolved" className="data-[state=active]:bg-blue-600">
                  已解决
                  <Badge className="ml-2 bg-green-500 text-white text-xs px-1.5 py-0.5">3</Badge>
                </TabsTrigger>
                <TabsTrigger value="config" className="data-[state=active]:bg-blue-600">告警策略</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="mt-6">
                <div className="space-y-4">
                  {alerts
                    .filter(alert => alert.status === "active")
                    .map((alert) => (
                    <Card key={alert.id} className={`border-l-4 ${alert.severity === 'critical' ? 'border-l-red-500 bg-red-500/5' : alert.severity === 'warning' ? 'border-l-yellow-500 bg-yellow-500/5' : 'border-l-blue-500 bg-blue-500/5'} bg-slate-800/50 border-slate-600`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getSeverityColor(alert.severity)}`}>
                                {getSeverityIcon(alert.severity)}
                              </div>
                              <div>
                                <h4 className="text-white font-medium">{alert.title}</h4>
                                <p className="text-slate-400 text-sm">{alert.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 mt-3">
                              <Badge 
                                variant="outline" 
                                className={getSeverityColor(alert.severity)}
                              >
                                {alert.severity === 'critical' ? '严重' : alert.severity === 'warning' ? '警告' : '信息'}
                              </Badge>
                              <Badge variant="outline" className="bg-slate-600/50 text-slate-300 border-slate-500">
                                {alert.node}
                              </Badge>
                              <span className="text-slate-400 text-sm">{alert.time}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                              onClick={() => handleAcknowledge(alert.id)}
                            >
                              确认
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                              onClick={() => handleIgnore(alert.id)}
                            >
                              忽略
                            </Button>
                            <Button 
                              size="sm" 
                              className={`bg-blue-600 hover:bg-blue-700 transition-all duration-200 ${
                                processingAlerts.has(alert.id) 
                                  ? 'animate-pulse bg-blue-700 cursor-not-allowed' 
                                  : 'hover:scale-105'
                              }`}
                              onClick={() => handleProcess(alert.id)}
                              disabled={processingAlerts.has(alert.id)}
                            >
                              {processingAlerts.has(alert.id) ? (
                                <div className="flex items-center space-x-2">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span>处理中</span>
                                </div>
                              ) : (
                                '处理'
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="acknowledged" className="mt-6">
                <div className="space-y-4">
                  {alerts
                    .filter(alert => alert.status === "acknowledged")
                    .map((alert) => (
                    <Card key={alert.id} className="bg-slate-800/50 border-slate-600">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getSeverityColor(alert.severity)}`}>
                                {getSeverityIcon(alert.severity)}
                              </div>
                              <div>
                                <h4 className="text-white font-medium">{alert.title}</h4>
                                <p className="text-slate-400 text-sm">{alert.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 mt-3">
                              <Badge 
                                variant="outline" 
                                className={getSeverityColor(alert.severity)}
                              >
                                {alert.severity === 'critical' ? '严重' : alert.severity === 'warning' ? '警告' : '信息'}
                              </Badge>
                              <Badge variant="outline" className="bg-slate-600/50 text-slate-300 border-slate-500">
                                {alert.node}
                              </Badge>
                              <span className="text-slate-400 text-sm">{alert.time}</span>
                              {alert.acknowledgedBy && (
                                <span className="text-green-400 text-sm">已由 {alert.acknowledgedBy} 确认</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              解决
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="resolved" className="mt-6">
                <div className="space-y-4">
                  {alerts
                    .filter(alert => alert.status === "resolved")
                    .map((alert) => (
                    <Card key={alert.id} className="bg-slate-800/30 border-slate-600 opacity-75">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              </div>
                              <div>
                                <h4 className="text-white font-medium">{alert.title}</h4>
                                <p className="text-slate-400 text-sm">{alert.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 mt-3">
                              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                                已解决
                              </Badge>
                              <Badge variant="outline" className="bg-slate-600/50 text-slate-300 border-slate-500">
                                {alert.node}
                              </Badge>
                              <span className="text-slate-400 text-sm">{alert.time}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="config" className="mt-6">
                <div className="space-y-6">
                  <Card className="glass-effect border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">告警策略配置</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-slate-300 text-sm font-medium">CPU使用率阈值</label>
                          <div className="flex items-center space-x-2 mt-2">
                            <Input 
                              type="number" 
                              defaultValue="85" 
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                            <span className="text-slate-400">%</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-slate-300 text-sm font-medium">内存使用率阈值</label>
                          <div className="flex items-center space-x-2 mt-2">
                            <Input 
                              type="number" 
                              defaultValue="90" 
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                            <span className="text-slate-400">%</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-slate-300 text-sm font-medium">网络延迟阈值</label>
                          <div className="flex items-center space-x-2 mt-2">
                            <Input 
                              type="number" 
                              defaultValue="50" 
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                            <span className="text-slate-400">ms</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-slate-300 text-sm font-medium">丢包率阈值</label>
                          <div className="flex items-center space-x-2 mt-2">
                            <Input 
                              type="number" 
                              defaultValue="0.1" 
                              step="0.01"
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                            <span className="text-slate-400">%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                          重置
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          保存配置
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

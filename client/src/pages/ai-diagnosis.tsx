import { useState } from "react";
import { Header } from "@/components/layout/header";
import { ChatInterface } from "@/components/ai/chat-interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Zap, 
  Search, 
  Download,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from "lucide-react";

export default function AiDiagnosis() {
  const [selectedNode, setSelectedNode] = useState("");
  const [selectedTimeRange, setSelectedTimeRange] = useState("1h");

  const diagnosticStats = [
    {
      label: "诊断会话",
      value: "47",
      icon: <MessageSquare className="w-5 h-5" />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      label: "发现问题",
      value: "12",
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "text-red-400", 
      bgColor: "bg-red-500/20"
    },
    {
      label: "解决建议",
      value: "28",
      icon: <Target className="w-5 h-5" />,
      color: "text-green-400",
      bgColor: "bg-green-500/20"
    },
    {
      label: "平均响应",
      value: "2.3s",
      icon: <Clock className="w-5 h-5" />,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20"
    }
  ];

  const quickActions = [
    "网络健康检查",
    "性能优化建议", 
    "故障根因分析",
    "流量异常检测",
    "安全风险评估",
    "容量规划建议"
  ];

  const recentDiagnosis = [
    {
      id: "1",
      title: "核心路由器性能分析",
      query: "Router-01 CPU使用率过高的原因分析",
      summary: "检测到多个高带宽应用同时运行，建议进行流量优化和负载均衡调整",
      severity: "warning",
      time: "5分钟前",
      status: "completed"
    },
    {
      id: "2",
      title: "网络延迟异常诊断",
      query: "Edge-02 到核心节点延迟突然增加",
      summary: "发现中间链路出现拥塞，建议检查交换机端口配置和流量策略",
      severity: "critical",
      time: "12分钟前", 
      status: "completed"
    },
    {
      id: "3",
      title: "交换机流量模式分析",
      query: "Switch-05 流量模式异常分析",
      summary: "正在分析流量模式变化和可能的原因...",
      severity: "info",
      time: "正在进行",
      status: "processing"
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-400 bg-green-500/20";
      case "processing": return "text-yellow-400 bg-yellow-500/20";
      case "failed": return "text-red-400 bg-red-500/20";
      default: return "text-slate-400 bg-slate-500/20";
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="AI智能诊断" />
      
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {diagnosticStats.map((stat, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="glass-effect border-slate-700 h-[600px]">
              <CardHeader className="border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-blue-400" />
                    AI诊断助手
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 text-sm">在线</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-4rem)]">
                <ChatInterface />
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Quick Diagnosis */}
            <Card className="glass-effect border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  快速诊断
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">选择节点</label>
                  <Select value={selectedNode} onValueChange={setSelectedNode}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="选择要诊断的节点" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="router-01">Router-01</SelectItem>
                      <SelectItem value="switch-03">Switch-03</SelectItem>
                      <SelectItem value="server-db-01">Server-DB-01</SelectItem>
                      <SelectItem value="edge-02">Edge-02</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">时间范围</label>
                  <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">最近1小时</SelectItem>
                      <SelectItem value="6h">最近6小时</SelectItem>
                      <SelectItem value="24h">最近24小时</SelectItem>
                      <SelectItem value="7d">最近7天</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!selectedNode}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  开始AI诊断
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-effect border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">快捷操作</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start bg-slate-700/50 border-slate-600 hover:bg-slate-600/50 text-slate-300 hover:text-white"
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="glass-effect border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  AI洞察
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
                    <div>
                      <p className="text-blue-400 text-sm font-medium">性能建议</p>
                      <p className="text-slate-300 text-xs mt-1">
                        检测到3个节点可进行性能优化，预计可提升15%效率
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2" />
                    <div>
                      <p className="text-yellow-400 text-sm font-medium">容量预警</p>
                      <p className="text-slate-300 text-xs mt-1">
                        预测网络流量将在未来7天内增长25%
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
                    <div>
                      <p className="text-green-400 text-sm font-medium">系统健康</p>
                      <p className="text-slate-300 text-xs mt-1">
                        整体网络健康度达到96.8%，表现良好
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Diagnosis */}
        <Card className="glass-effect border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">最近诊断记录</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                  <Search className="w-4 h-4 mr-2" />
                  搜索
                </Button>
                <Button variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                  <Download className="w-4 h-4 mr-2" />
                  导出
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDiagnosis.map((item) => (
                <Card key={item.id} className="bg-slate-800/50 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Brain className="w-5 h-5 text-blue-400" />
                          <div>
                            <h4 className="text-white font-medium">{item.title}</h4>
                            <p className="text-slate-400 text-sm">{item.query}</p>
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm mb-3 ml-8">{item.summary}</p>
                        <div className="flex items-center space-x-4 ml-8">
                          <Badge 
                            variant="outline" 
                            className={getSeverityColor(item.severity)}
                          >
                            {item.severity === 'critical' ? '严重' : item.severity === 'warning' ? '警告' : '信息'}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={getStatusColor(item.status)}
                          >
                            {item.status === 'completed' ? '已完成' : item.status === 'processing' ? '进行中' : '失败'}
                          </Badge>
                          <span className="text-slate-400 text-sm">{item.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.status === 'completed' && (
                          <>
                            <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                              查看详情
                            </Button>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              应用建议
                            </Button>
                          </>
                        )}
                        {item.status === 'processing' && (
                          <div className="flex items-center space-x-2 text-yellow-400">
                            <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm">分析中...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  Shield, 
  Clock,
  Download,
  Calendar,
  Filter
} from "lucide-react";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("24h");
  const [selectedMetric, setSelectedMetric] = useState("bandwidth");
  const [isExporting, setIsExporting] = useState(false);
  const [isCustomTimeOpen, setIsCustomTimeOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [customStartTime, setCustomStartTime] = useState("");
  const [customEndTime, setCustomEndTime] = useState("");
  const { toast } = useToast();

  // Handle time range change
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    toast({
      title: "时间范围已更新",
      description: `已切换到 ${getTimeRangeLabel(value)}`,
    });
  };

  // Handle metric change
  const handleMetricChange = (value: string) => {
    setSelectedMetric(value);
    toast({
      title: "指标已更新",
      description: `已切换到 ${getMetricLabel(value)}`,
    });
  };

  // Handle custom time picker
  const handleCustomTime = () => {
    setIsCustomTimeOpen(true);
  };

  // Handle custom time range application
  const handleApplyCustomTime = () => {
    if (!customStartDate || !customEndDate) {
      toast({
        title: "请选择时间范围",
        description: "开始日期和结束日期都必须填写",
        variant: "destructive",
      });
      return;
    }

    const startDateTime = `${customStartDate} ${customStartTime || "00:00"}`;
    const endDateTime = `${customEndDate} ${customEndTime || "23:59"}`;
    
    setTimeRange("custom");
    setIsCustomTimeOpen(false);
    
    toast({
      title: "自定义时间范围已应用",
      description: `从 ${startDateTime} 到 ${endDateTime}`,
    });
  };

  // Get current date for date input max values
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Handle export with animation
  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "导出成功",
        description: "报告已生成并下载到本地",
      });
    } catch (error) {
      toast({
        title: "导出失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Helper functions
  const getTimeRangeLabel = (value: string) => {
    const labels: Record<string, string> = {
      "1h": "最近1小时",
      "24h": "最近24小时", 
      "7d": "最近7天",
      "30d": "最近30天"
    };
    return labels[value] || value;
  };

  const getMetricLabel = (value: string) => {
    const labels: Record<string, string> = {
      "bandwidth": "带宽利用率",
      "latency": "网络延迟",
      "packets": "数据包丢失",
      "throughput": "吞吐量"
    };
    return labels[value] || value;
  };

  // Sample data for charts
  const networkTrafficData = [
    { time: "00:00", inbound: 45, outbound: 35, total: 80 },
    { time: "04:00", inbound: 38, outbound: 32, total: 70 },
    { time: "08:00", inbound: 65, outbound: 58, total: 123 },
    { time: "12:00", inbound: 85, outbound: 72, total: 157 },
    { time: "16:00", inbound: 95, outbound: 82, total: 177 },
    { time: "20:00", inbound: 88, outbound: 78, total: 166 },
    { time: "24:00", inbound: 67, outbound: 58, total: 125 }
  ];

  const latencyData = [
    { time: "00:00", avg: 24, p95: 45, p99: 89 },
    { time: "04:00", avg: 22, p95: 42, p99: 85 },
    { time: "08:00", avg: 28, p95: 52, p99: 95 },
    { time: "12:00", avg: 35, p95: 68, p99: 125 },
    { time: "16:00", avg: 32, p95: 62, p99: 115 },
    { time: "20:00", avg: 29, p95: 58, p99: 105 },
    { time: "24:00", avg: 26, p95: 48, p99: 92 }
  ];

  const packetLossData = [
    { time: "00:00", loss: 0.02 },
    { time: "04:00", loss: 0.01 },
    { time: "08:00", loss: 0.03 },
    { time: "12:00", loss: 0.08 },
    { time: "16:00", loss: 0.05 },
    { time: "20:00", loss: 0.04 },
    { time: "24:00", loss: 0.02 }
  ];

  const nodeDistribution = [
    { name: "路由器", value: 45, color: "#3b82f6" },
    { name: "交换机", value: 35, color: "#06b6d4" },
    { name: "服务器", value: 15, color: "#10b981" },
    { name: "终端", value: 5, color: "#f59e0b" }
  ];

  const topNodesData = [
    { name: "Core-Router-01", cpu: 89, memory: 76, network: 92 },
    { name: "Edge-Switch-03", cpu: 67, memory: 54, network: 78 },
    { name: "Server-DB-01", cpu: 78, memory: 89, network: 45 },
    { name: "Router-Branch-05", cpu: 56, memory: 43, network: 67 },
    { name: "Switch-Access-12", cpu: 45, memory: 38, network: 56 }
  ];

  // Realistic trend prediction data based on historical patterns
  const trendPredictionData = [
    // Historical data (past 7 days)
    { time: "7天前", actual: 68, predicted: null, type: "historical" },
    { time: "6天前", actual: 72, predicted: null, type: "historical" },
    { time: "5天前", actual: 65, predicted: null, type: "historical" },
    { time: "4天前", actual: 78, predicted: null, type: "historical" },
    { time: "3天前", actual: 82, predicted: null, type: "historical" },
    { time: "2天前", actual: 75, predicted: null, type: "historical" },
    { time: "昨天", actual: 79, predicted: null, type: "historical" },
    { time: "今天", actual: 83, predicted: 83, type: "current" },
    // Predicted future data (next 7 days)
    { time: "明天", actual: null, predicted: 86, confidence: 0.92, type: "prediction" },
    { time: "2天后", actual: null, predicted: 89, confidence: 0.88, type: "prediction" },
    { time: "3天后", actual: null, predicted: 85, confidence: 0.84, type: "prediction" },
    { time: "4天后", actual: null, predicted: 91, confidence: 0.79, type: "prediction" },
    { time: "5天后", actual: null, predicted: 87, confidence: 0.75, type: "prediction" },
    { time: "6天后", actual: null, predicted: 93, confidence: 0.71, type: "prediction" },
    { time: "7天后", actual: null, predicted: 88, confidence: 0.67, type: "prediction" }
  ];

  const networkCapacityTrends = [
    { time: "当前", bandwidth: 73, latency: 28, packets: 0.04 },
    { time: "+1天", bandwidth: 76, latency: 30, packets: 0.05 },
    { time: "+2天", bandwidth: 79, latency: 32, packets: 0.06 },
    { time: "+3天", bandwidth: 75, latency: 29, packets: 0.04 },
    { time: "+4天", bandwidth: 82, latency: 35, packets: 0.07 },
    { time: "+5天", bandwidth: 78, latency: 31, packets: 0.05 },
    { time: "+6天", bandwidth: 84, latency: 37, packets: 0.08 },
    { time: "+7天", bandwidth: 80, latency: 33, packets: 0.06 }
  ];

  const alertPredictions = [
    { category: "带宽告警", current: 12, predicted: 15, trend: "增加", probability: 0.78 },
    { category: "延迟告警", current: 8, predicted: 11, trend: "增加", probability: 0.65 },
    { category: "丢包告警", current: 5, predicted: 3, trend: "减少", probability: 0.82 },
    { category: "设备告警", current: 7, predicted: 9, trend: "增加", probability: 0.71 }
  ];

  const kpiCards = [
    {
      title: "平均带宽利用率",
      value: "67.8%",
      change: "+2.3%",
      trend: "up",
      icon: <Activity className="w-5 h-5" />,
      color: "text-blue-400"
    },
    {
      title: "平均网络延迟",
      value: "28ms",
      change: "-3ms",
      trend: "down",
      icon: <Clock className="w-5 h-5" />,
      color: "text-green-400"
    },
    {
      title: "数据包丢失率",
      value: "0.04%",
      change: "+0.01%",
      trend: "up",
      icon: <Shield className="w-5 h-5" />,
      color: "text-yellow-400"
    },
    {
      title: "网络可用性",
      value: "99.97%",
      change: "+0.02%",
      trend: "up",
      icon: <Zap className="w-5 h-5" />,
      color: "text-green-400"
    }
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="数据分析" />
      
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Feature Description */}
        <Card className="glass-effect border-slate-700">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">系统功能概述</h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  企业级网络监控数据分析平台，提供全面的网络性能评估和智能预测分析。系统集成实时数据采集、多维度指标监控、智能告警预警和趋势预测功能，帮助网络管理员深入了解网络运行状况，及时发现潜在问题，优化网络配置，确保业务连续性和网络稳定性，提升整体运维效率。
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                  <h3 className="text-blue-400 font-medium mb-2">网络流量</h3>
                  <p className="text-slate-300 text-xs">
                    实时监控网络数据传输情况，展示入站出站流量趋势，分析带宽利用率和数据传输模式，识别流量异常和网络瓶颈。
                  </p>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                  <h3 className="text-green-400 font-medium mb-2">性能指标</h3>
                  <p className="text-slate-300 text-xs">
                    监测网络延迟、数据包丢失率、吞吐量等关键性能参数，提供多层次性能分析视图，帮助评估网络服务质量。
                  </p>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                  <h3 className="text-purple-400 font-medium mb-2">节点分析</h3>
                  <p className="text-slate-300 text-xs">
                    深度分析各网络节点运行状态，监控设备资源使用情况，评估节点性能表现，识别高负载和故障风险节点。
                  </p>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                  <h3 className="text-yellow-400 font-medium mb-2">趋势预测</h3>
                  <p className="text-slate-300 text-xs">
                    基于历史数据和机器学习算法，预测网络性能变化趋势，提前识别潜在问题，支持容量规划和预防性维护决策。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-32 bg-slate-700 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">最近1小时</SelectItem>
                <SelectItem value="24h">最近24小时</SelectItem>
                <SelectItem value="7d">最近7天</SelectItem>
                <SelectItem value="30d">最近30天</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedMetric} onValueChange={handleMetricChange}>
              <SelectTrigger className="w-40 bg-slate-700 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bandwidth">带宽利用率</SelectItem>
                <SelectItem value="latency">网络延迟</SelectItem>
                <SelectItem value="packets">数据包丢失</SelectItem>
                <SelectItem value="throughput">吞吐量</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={isCustomTimeOpen} onOpenChange={setIsCustomTimeOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-slate-700 border-slate-600 hover:bg-slate-600 transition-all duration-200"
                  onClick={handleCustomTime}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  自定义时间
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-600 max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-white">选择自定义时间范围</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">开始日期</Label>
                      <Input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        max={getCurrentDate()}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">开始时间</Label>
                      <Input
                        type="time"
                        value={customStartTime}
                        onChange={(e) => setCustomStartTime(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">结束日期</Label>
                      <Input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        max={getCurrentDate()}
                        min={customStartDate}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">结束时间</Label>
                      <Input
                        type="time"
                        value={customEndTime}
                        onChange={(e) => setCustomEndTime(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-blue-300 text-sm">
                      选择时间范围后，数据分析将基于您指定的时间段进行计算
                    </span>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCustomTimeOpen(false)}
                      className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                    >
                      取消
                    </Button>
                    <Button 
                      onClick={handleApplyCustomTime}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      应用时间范围
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              variant="outline" 
              className="bg-slate-700 border-slate-600 hover:bg-slate-600 transition-all duration-200"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
                  导出中...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  导出报告
                </>
              )}
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((kpi, index) => (
            <Card key={index} className="glass-effect border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{kpi.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{kpi.value}</p>
                    <div className="flex items-center mt-1">
                      {kpi.trend === "up" ? (
                        <TrendingUp className={`w-4 h-4 mr-1 ${kpi.trend === "up" && kpi.change.startsWith("+") ? "text-green-400" : "text-red-400"}`} />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1 text-green-400" />
                      )}
                      <span className={`text-sm ${kpi.trend === "up" && kpi.change.startsWith("+") ? "text-green-400" : kpi.trend === "down" ? "text-green-400" : "text-red-400"}`}>
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 ${kpi.color.replace('text-', 'bg-').replace('400', '500/20')} rounded-lg flex items-center justify-center`}>
                    {kpi.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Charts */}
        <Tabs defaultValue="traffic" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-700">
            <TabsTrigger value="traffic" className="data-[state=active]:bg-blue-600">网络流量</TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-blue-600">性能指标</TabsTrigger>
            <TabsTrigger value="nodes" className="data-[state=active]:bg-blue-600">节点分析</TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-blue-600">趋势预测</TabsTrigger>
          </TabsList>

          <TabsContent value="traffic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Network Traffic Chart */}
              <Card className="glass-effect border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">网络流量趋势</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={networkTrafficData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Area type="monotone" dataKey="inbound" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="outbound" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Node Distribution */}
              <Card className="glass-effect border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">节点类型分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={nodeDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {nodeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4">
                    {nodeDistribution.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-300 text-sm">{item.name}</span>
                        <Badge variant="outline" className="text-xs">{item.value}%</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Latency Chart */}
              <Card className="glass-effect border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">网络延迟分析</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={latencyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Line type="monotone" dataKey="avg" stroke="#10b981" strokeWidth={2} name="平均延迟" />
                        <Line type="monotone" dataKey="p95" stroke="#f59e0b" strokeWidth={2} name="P95延迟" />
                        <Line type="monotone" dataKey="p99" stroke="#ef4444" strokeWidth={2} name="P99延迟" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Packet Loss Chart */}
              <Card className="glass-effect border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">数据包丢失率</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={packetLossData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Area type="monotone" dataKey="loss" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="nodes" className="space-y-6">
            <Card className="glass-effect border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">节点性能排行</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topNodesData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" stroke="#94a3b8" />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" width={120} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="cpu" fill="#3b82f6" name="CPU" />
                      <Bar dataKey="memory" fill="#06b6d4" name="内存" />
                      <Bar dataKey="network" fill="#10b981" name="网络" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Main Trend Prediction Chart */}
              <Card className="glass-effect border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">带宽利用率趋势预测</CardTitle>
                  <p className="text-slate-400 text-sm">基于历史数据的7天预测分析</p>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendPredictionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" domain={[60, 100]} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                          formatter={(value, name, props) => {
                            const confidence = props.payload?.confidence;
                            return [
                              `${value}%${confidence ? ` (置信度: ${(confidence * 100).toFixed(0)}%)` : ''}`,
                              name === 'actual' ? '实际值' : '预测值'
                            ];
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="actual" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          name="实际值"
                          connectNulls={false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="predicted" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="预测值"
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center space-x-6 mt-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-slate-300 text-sm">历史数据</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-1 bg-blue-400 rounded-full"></div>
                      <span className="text-slate-300 text-sm">预测趋势</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Capacity Trends */}
              <Card className="glass-effect border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">网络容量趋势</CardTitle>
                  <p className="text-slate-400 text-sm">未来7天关键指标预测</p>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={networkCapacityTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Line type="monotone" dataKey="bandwidth" stroke="#3b82f6" strokeWidth={2} name="带宽利用率(%)" />
                        <Line type="monotone" dataKey="latency" stroke="#f59e0b" strokeWidth={2} name="延迟(ms)" />
                        <Line type="monotone" dataKey="packets" stroke="#ef4444" strokeWidth={2} name="丢包率(%)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alert Predictions */}
            <Card className="glass-effect border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">告警趋势预测</CardTitle>
                <p className="text-slate-400 text-sm">基于历史模式的告警数量预测</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {alertPredictions.map((alert, index) => (
                    <div key={index} className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-medium">{alert.category}</h4>
                        <Badge 
                          variant="outline" 
                          className={`${alert.trend === '增加' ? 'text-red-400 border-red-500/30' : 'text-green-400 border-green-500/30'}`}
                        >
                          {alert.trend}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-sm">当前</span>
                          <span className="text-white font-medium">{alert.current}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-sm">预测</span>
                          <span className="text-white font-medium">{alert.predicted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-sm">置信度</span>
                          <span className="text-blue-400 font-medium">{(alert.probability * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className="mt-3 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-blue-400 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${alert.probability * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

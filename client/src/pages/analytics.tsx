import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
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
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
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
            <Button variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
              <Filter className="w-4 h-4 mr-2" />
              筛选
            </Button>
            <Button variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
              <Calendar className="w-4 h-4 mr-2" />
              自定义时间
            </Button>
            <Button variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
              <Download className="w-4 h-4 mr-2" />
              导出报告
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
            <Card className="glass-effect border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">趋势预测分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-slate-400">趋势预测功能开发中...</p>
                    <p className="text-slate-500 text-sm mt-2">基于机器学习的智能预测即将上线</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

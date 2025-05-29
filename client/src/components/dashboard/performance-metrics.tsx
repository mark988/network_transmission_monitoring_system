import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

interface MetricData {
  label: string;
  value: number;
  status: "normal" | "warning" | "critical";
}

export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<MetricData[]>([
    { label: "CPU使用率", value: 68, status: "normal" },
    { label: "内存使用率", value: 54, status: "normal" },
    { label: "磁盘I/O", value: 23, status: "normal" },
    { label: "网络I/O", value: 89, status: "warning" }
  ]);

  const { data: performanceData } = useQuery({
    queryKey: ["/api/dashboard/performance"],
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (performanceData) {
      setMetrics(performanceData);
    } else {
      // Simulate real-time updates
      const interval = setInterval(() => {
        setMetrics(prev => prev.map(metric => ({
          ...metric,
          value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 5))
        })));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [performanceData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "from-red-500 to-red-600";
      case "warning": return "from-yellow-500 to-orange-500";
      default: return "from-green-500 to-blue-500";
    }
  };

  const getStatusBadge = (value: number) => {
    if (value >= 90) return { text: "严重", color: "bg-red-500/20 text-red-400" };
    if (value >= 70) return { text: "警告", color: "bg-yellow-500/20 text-yellow-400" };
    return { text: "正常", color: "bg-green-500/20 text-green-400" };
  };

  const systemStatus = metrics.some(m => m.value >= 90) ? "严重" : 
                     metrics.some(m => m.value >= 70) ? "注意" : "良好";

  const systemStatusColor = systemStatus === "严重" ? "text-red-400" : 
                           systemStatus === "注意" ? "text-yellow-400" : "text-green-400";

  return (
    <Card className="glass-effect border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-lg font-semibold text-white">系统性能指标</CardTitle>
        <span className="text-sm text-slate-400">实时监控</span>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {metrics.map((metric, index) => {
          const status = getStatusBadge(metric.value);
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">{metric.label}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white">{Math.round(metric.value)}%</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${status.color} border-current`}
                  >
                    {status.text}
                  </Badge>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`bg-gradient-to-r ${getStatusColor(metric.status)} h-2 rounded-full transition-all duration-1000`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          );
        })}
        
        {/* Performance Summary */}
        <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              systemStatus === "严重" ? "bg-red-400" :
              systemStatus === "注意" ? "bg-yellow-400" : "bg-green-400"
            }`} />
            <div>
              <p className="text-sm font-medium text-white">
                系统状态：<span className={systemStatusColor}>{systemStatus}</span>
              </p>
              <p className="text-xs text-slate-400">
                {systemStatus === "严重" ? "发现性能问题，建议立即处理" :
                 systemStatus === "注意" ? "部分指标偏高，建议关注" :
                 "所有指标正常，系统运行良好"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Server, Network, Zap } from "lucide-react";

interface Node {
  id: string;
  name: string;
  ip: string;
  type: "router" | "switch" | "server";
  score: number;
  status: "online" | "warning" | "offline";
  stability?: number;
}

type SortMode = "performance" | "stability";

export function TopPerformers() {
  const [sortMode, setSortMode] = useState<SortMode>("performance");
  
  const { data: topNodes } = useQuery({
    queryKey: ["/api/dashboard/top-performers"],
    refetchInterval: 60000,
  });

  // Fallback data when API is not available  
  const defaultNodes: Node[] = [
    {
      id: "1",
      name: "Core-Router-03",
      ip: "192.168.1.103",
      type: "router",
      score: 98.5,
      stability: 99.2,
      status: "online"
    },
    {
      id: "2", 
      name: "Switch-07",
      ip: "192.168.2.107",
      type: "switch",
      score: 96.8,
      stability: 97.5,
      status: "online"
    },
    {
      id: "3",
      name: "Edge-Router-05", 
      ip: "192.168.3.105",
      type: "router",
      score: 94.2,
      stability: 88.7,
      status: "online"
    },
    {
      id: "4",
      name: "Router-01",
      ip: "192.168.1.101", 
      type: "router",
      score: 87.3,
      stability: 92.1,
      status: "warning"
    }
  ];

  const nodeData = (topNodes as Node[]) || defaultNodes;

  // 根据排序模式对节点数据进行排序
  const sortedNodes = [...nodeData].sort((a, b) => {
    if (sortMode === "performance") {
      return b.score - a.score;
    } else {
      return (b.stability || 0) - (a.stability || 0);
    }
  });

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "router": return <Server className="w-5 h-5" />;
      case "switch": return <Network className="w-5 h-5" />;
      case "server": return <Zap className="w-5 h-5" />;
      default: return <Server className="w-5 h-5" />;
    }
  };

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case "router": return "bg-green-500/20 text-green-400";
      case "switch": return "bg-blue-500/20 text-blue-400";
      case "server": return "bg-cyan-500/20 text-cyan-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-400";
      case "warning": return "bg-yellow-400 animate-pulse";
      case "offline": return "bg-red-400";
      default: return "bg-gray-400";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return "text-green-400";
    if (score >= 90) return "text-blue-400";
    if (score >= 85) return "text-cyan-400";
    return "text-yellow-400";
  };

  const getStatusLabel = (status: string, score: number) => {
    if (status === "warning") return "需要关注";
    if (score >= 95) return "优秀运行";
    if (score >= 90) return "良好运行";
    return "稳定运行";
  };

  const getStabilityLabel = (stability: number) => {
    if (stability >= 98) return "极其稳定";
    if (stability >= 95) return "高度稳定";
    if (stability >= 90) return "稳定运行";
    if (stability >= 85) return "基本稳定";
    return "需要优化";
  };

  return (
    <Card className="glass-effect border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-lg font-semibold text-white">节点性能排行</CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            onClick={() => setSortMode("performance")}
            className={`text-xs px-3 py-1 transition-colors ${
              sortMode === "performance" 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "bg-slate-600 hover:bg-slate-500 text-white border-slate-600"
            }`}
          >
            性能
          </Button>
          <Button 
            size="sm"
            onClick={() => setSortMode("stability")}
            className={`text-xs px-3 py-1 transition-colors ${
              sortMode === "stability" 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "bg-slate-600 hover:bg-slate-500 text-white border-slate-600"
            }`}
          >
            稳定性
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {sortedNodes.map((node, index) => (
          <div 
            key={node.id} 
            className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getNodeTypeColor(node.type)}`}>
                  {getNodeIcon(node.type)}
                </div>
                {index < 3 && (
                  <Badge 
                    className={`absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                    }`}
                  >
                    {index + 1}
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{node.name}</p>
                <p className="text-xs text-slate-400">{node.ip}</p>
              </div>
            </div>
            <div className="text-right flex items-center space-x-3">
              <div>
                <p className={`text-sm font-bold ${getScoreColor(sortMode === "performance" ? node.score : (node.stability || 0))}`}>
                  {sortMode === "performance" ? node.score : (node.stability || 0).toFixed(1)}%
                </p>
                <p className="text-xs text-slate-400">
                  {sortMode === "performance" 
                    ? getStatusLabel(node.status, node.score)
                    : getStabilityLabel(node.stability || 0)
                  }
                </p>
              </div>
              <div className={`w-2 h-2 rounded-full ${getStatusColor(node.status)}`} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

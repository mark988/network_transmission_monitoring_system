import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Server, Network, Zap, Monitor, MapPin, Building } from "lucide-react";
import type { NetworkNode } from "@shared/schema";

interface NodeMapProps {
  searchTerm: string;
  onNodeEdit: (node: NetworkNode) => void;
}

export function NodeMap({ searchTerm, onNodeEdit }: NodeMapProps) {
  const { data: nodes, isLoading } = useQuery({
    queryKey: ["/api/nodes"],
    refetchInterval: 30000,
  });

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "router": return <Server className="w-4 h-4" />;
      case "switch": return <Network className="w-4 h-4" />;
      case "server": return <Zap className="w-4 h-4" />;
      case "endpoint": return <Monitor className="w-4 h-4" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-400";
      case "warning": return "bg-yellow-400";
      case "offline": return "bg-red-400";
      case "error": return "bg-red-400";
      default: return "bg-slate-400";
    }
  };

  const getNodeTypeLabel = (type: string) => {
    switch (type) {
      case "router": return "路由器";
      case "switch": return "交换机";
      case "server": return "服务器";
      case "endpoint": return "终端";
      default: return type;
    }
  };

  // Filter nodes based on search term
  const filteredNodes = nodes?.filter((node: NetworkNode) => 
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.ipAddress.includes(searchTerm) ||
    node.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.location?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Group nodes by location
  const nodesByLocation = filteredNodes.reduce((acc: Record<string, NetworkNode[]>, node: NetworkNode) => {
    const location = node.location || "未知位置";
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(node);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-600">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Network Infrastructure Map */}
      <Card className="bg-slate-800/50 border-slate-600">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">网络基础设施分布图</h3>
          </div>
          
          {/* Simulated Network Map */}
          <div className="bg-slate-900/50 rounded-lg p-8 min-h-[400px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-green-500/5"></div>
            
            {/* Data Center Areas */}
            <div className="relative h-full">
              {/* Core Network Area */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-500/20 border-2 border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-center text-blue-400 font-medium mb-2">核心网络区域</div>
                  <div className="flex space-x-3">
                    {filteredNodes.filter((node: NetworkNode) => 
                      node.type === "router" && node.status === "online"
                    ).slice(0, 2).map((node: NetworkNode) => (
                      <div 
                        key={node.id}
                        className="bg-slate-800 rounded-lg p-2 border border-blue-500/50 cursor-pointer hover:bg-slate-700 transition-colors"
                        onClick={() => onNodeEdit(node)}
                      >
                        <div className="flex items-center space-x-2">
                          {getNodeIcon(node.type)}
                          <div className="text-xs text-white">{node.name}</div>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(node.status)}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Server Room Area */}
              <div className="absolute top-32 left-8">
                <div className="bg-green-500/20 border-2 border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-center text-green-400 font-medium mb-2">服务器机房</div>
                  <div className="space-y-2">
                    {filteredNodes.filter((node: NetworkNode) => 
                      node.type === "server"
                    ).slice(0, 3).map((node: NetworkNode) => (
                      <div 
                        key={node.id}
                        className="bg-slate-800 rounded p-2 border border-green-500/50 cursor-pointer hover:bg-slate-700 transition-colors"
                        onClick={() => onNodeEdit(node)}
                      >
                        <div className="flex items-center space-x-2">
                          {getNodeIcon(node.type)}
                          <div className="text-xs text-white">{node.name}</div>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(node.status)}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Edge Network Area */}
              <div className="absolute top-32 right-8">
                <div className="bg-cyan-500/20 border-2 border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-center text-cyan-400 font-medium mb-2">边缘网络</div>
                  <div className="space-y-2">
                    {filteredNodes.filter((node: NetworkNode) => 
                      node.type === "switch"
                    ).slice(0, 2).map((node: NetworkNode) => (
                      <div 
                        key={node.id}
                        className="bg-slate-800 rounded p-2 border border-cyan-500/50 cursor-pointer hover:bg-slate-700 transition-colors"
                        onClick={() => onNodeEdit(node)}
                      >
                        <div className="flex items-center space-x-2">
                          {getNodeIcon(node.type)}
                          <div className="text-xs text-white">{node.name}</div>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(node.status)}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Network Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Connection lines between network areas */}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                   refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                  </marker>
                </defs>
                
                {/* Core to Server */}
                <line x1="50%" y1="25%" x2="25%" y2="45%" 
                      stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5"
                      markerEnd="url(#arrowhead)" opacity="0.6">
                  <animate attributeName="stroke-dashoffset" 
                           values="0;10" dur="2s" repeatCount="indefinite"/>
                </line>
                
                {/* Core to Edge */}
                <line x1="50%" y1="25%" x2="75%" y2="45%" 
                      stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5"
                      markerEnd="url(#arrowhead)" opacity="0.6">
                  <animate attributeName="stroke-dashoffset" 
                           values="0;10" dur="2s" repeatCount="indefinite"/>
                </line>
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location-based Node Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(nodesByLocation).map(([location, locationNodes]) => (
          <Card key={location} className="bg-slate-800/50 border-slate-600">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Building className="w-5 h-5 text-slate-400" />
                <h4 className="font-medium text-white">{location}</h4>
                <Badge variant="outline" className="ml-auto">
                  {locationNodes.length} 个设备
                </Badge>
              </div>
              
              <div className="space-y-3">
                {locationNodes.map((node: NetworkNode) => (
                  <div 
                    key={node.id}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-colors cursor-pointer"
                    onClick={() => onNodeEdit(node)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        {getNodeIcon(node.type)}
                        <div className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full ${getStatusColor(node.status)}`}></div>
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{node.name}</div>
                        <div className="text-slate-400 text-xs">{getNodeTypeLabel(node.type)} • {node.ipAddress}</div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="text-slate-400 hover:text-white"
                    >
                      查看
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {Object.keys(nodesByLocation).length === 0 && (
        <Card className="bg-slate-800/50 border-slate-600">
          <CardContent className="p-12 text-center">
            <MapPin className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <div className="text-slate-400 mb-2">
              {searchTerm ? "未找到匹配的节点" : "暂无网络节点数据"}
            </div>
            <div className="text-slate-500 text-sm">
              {searchTerm ? "请尝试其他搜索条件" : "添加网络节点后将在地图中显示"}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
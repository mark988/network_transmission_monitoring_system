import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Server, 
  Network, 
  Zap, 
  Monitor,
  Edit, 
  Trash2, 
  MoreHorizontal,
  Circle
} from "lucide-react";

interface NetworkNode {
  id: string;
  name: string;
  type: string;
  ipAddress: string;
  macAddress?: string;
  location?: string;
  status: string;
  lastSeen?: string;
  createdAt: string;
}

interface NodeListProps {
  searchTerm: string;
  onNodeEdit: (node: NetworkNode) => void;
}

export function NodeList({ searchTerm, onNodeEdit }: NodeListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: nodes, isLoading, error } = useQuery({
    queryKey: ["/api/nodes"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const deleteNodeMutation = useMutation({
    mutationFn: async (nodeId: string) => {
      await apiRequest("DELETE", `/api/nodes/${nodeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nodes"] });
      toast({
        title: "节点已删除",
        description: "网络节点已成功删除",
      });
    },
    onError: (error) => {
      toast({
        title: "删除失败",
        description: "删除节点时发生错误",
        variant: "destructive",
      });
    },
  });

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "router": return <Server className="w-5 h-5" />;
      case "switch": return <Network className="w-5 h-5" />;
      case "server": return <Zap className="w-5 h-5" />;
      case "endpoint": return <Monitor className="w-5 h-5" />;
      default: return <Server className="w-5 h-5" />;
    }
  };

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case "router": return "bg-blue-500/20 text-blue-400";
      case "switch": return "bg-cyan-500/20 text-cyan-400";
      case "server": return "bg-green-500/20 text-green-400";
      case "endpoint": return "bg-purple-500/20 text-purple-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-green-400 bg-green-500/20 border-green-500/30";
      case "warning": return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "offline": return "text-red-400 bg-red-500/20 border-red-500/30";
      case "error": return "text-red-400 bg-red-500/20 border-red-500/30";
      default: return "text-slate-400 bg-slate-500/20 border-slate-500/30";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "online": return "在线";
      case "warning": return "警告";
      case "offline": return "离线";
      case "error": return "故障";
      case "unknown": return "未知";
      default: return status;
    }
  };

  const getStatusIndicatorColor = (status: string) => {
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

  const handleDeleteNode = (nodeId: string) => {
    if (confirm("确定要删除这个节点吗？此操作不可撤销。")) {
      deleteNodeMutation.mutate(nodeId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  // Filter nodes based on search term
  const filteredNodes = nodes?.filter((node: NetworkNode) => 
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.ipAddress.includes(searchTerm) ||
    node.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.location?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-600">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
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
          <div className="text-red-400 mb-2">加载节点失败</div>
          <div className="text-slate-400 text-sm">请检查网络连接或稍后重试</div>
        </CardContent>
      </Card>
    );
  }

  if (filteredNodes.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-600">
        <CardContent className="p-12 text-center">
          <Server className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <div className="text-slate-400 mb-2">
            {searchTerm ? "未找到匹配的节点" : "暂无网络节点"}
          </div>
          <div className="text-slate-500 text-sm">
            {searchTerm ? "请尝试其他搜索条件" : "点击添加节点按钮创建第一个网络节点"}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredNodes.map((node: NetworkNode) => (
        <Card key={node.id} className="bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getNodeTypeColor(node.type)}`}>
                    {getNodeIcon(node.type)}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${getStatusIndicatorColor(node.status)}`}>
                    {node.status === "online" && <Circle className="w-3 h-3 text-green-400 animate-pulse" />}
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h4 className="text-white font-medium">{node.name}</h4>
                    <Badge variant="outline" className={getStatusColor(node.status)}>
                      {getStatusLabel(node.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-slate-400">
                    <span>IP: {node.ipAddress}</span>
                    <span>类型: {getNodeTypeLabel(node.type)}</span>
                    {node.location && <span>位置: {node.location}</span>}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {node.lastSeen ? `最后见于: ${formatDate(node.lastSeen)}` : `创建于: ${formatDate(node.createdAt)}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                  onClick={() => onNodeEdit(node)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-red-600/20 border-red-600/30 hover:bg-red-600/30 text-red-400"
                  onClick={() => handleDeleteNode(node.id)}
                  disabled={deleteNodeMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

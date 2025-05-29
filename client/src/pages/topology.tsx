import { useState } from "react";
import { Header } from "@/components/layout/header";
import { TopologyCanvas } from "@/components/topology/topology-canvas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Settings,
  Filter,
  Download,
  Camera
} from "lucide-react";

export default function Topology() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="网络拓扑视图" />
      
      <main className="flex-1 overflow-hidden p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Main Topology View */}
          <div className="lg:col-span-3">
            <Card className="glass-effect border-slate-700 h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-white">网络拓扑图</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? "暂停" : "播放"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-5rem)]">
                <TopologyCanvas onNodeSelect={setSelectedNode} />
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Network Status */}
            <Card className="glass-effect border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">网络状态</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full status-indicator" />
                    <span className="text-slate-300 text-sm">正常</span>
                  </div>
                  <span className="text-white font-medium">1,203</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <span className="text-slate-300 text-sm">警告</span>
                  </div>
                  <span className="text-white font-medium">41</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <span className="text-slate-300 text-sm">故障</span>
                  </div>
                  <span className="text-white font-medium">3</span>
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card className="glass-effect border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  显示过滤
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">节点类型</label>
                  <div className="flex flex-wrap gap-2">
                    {["路由器", "交换机", "服务器", "终端"].map((type) => (
                      <Badge 
                        key={type}
                        variant="outline" 
                        className="bg-blue-500/20 text-blue-400 border-blue-500/30 cursor-pointer hover:bg-blue-500/30"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">连接状态</label>
                  <div className="flex flex-wrap gap-2">
                    {["活跃", "闲置", "故障"].map((status) => (
                      <Badge 
                        key={status}
                        variant="outline" 
                        className="bg-slate-600/50 text-slate-300 border-slate-500 cursor-pointer hover:bg-slate-500/50"
                      >
                        {status}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Node Info */}
            {selectedNode && (
              <Card className="glass-effect border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">节点详情</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-slate-400 text-xs">节点名称</label>
                    <p className="text-white text-sm font-medium">Core-Router-01</p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs">IP地址</label>
                    <p className="text-white text-sm">192.168.1.1</p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs">状态</label>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-green-400 text-sm">在线</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs">CPU使用率</label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full" style={{width: "68%"}} />
                      </div>
                      <span className="text-white text-sm">68%</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    查看详情
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Topology Settings */}
            <Card className="glass-effect border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  拓扑设置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">布局算法</label>
                  <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                    <option>力导向布局</option>
                    <option>层次布局</option>
                    <option>圆形布局</option>
                    <option>网格布局</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">动画速度</label>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    defaultValue="5"
                    className="w-full accent-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">数据流显示</label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="accent-blue-500" />
                    <span className="text-slate-300 text-sm">显示数据流动画</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

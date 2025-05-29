import { useState } from "react";
import { Header } from "@/components/layout/header";
import { NodeList } from "@/components/nodes/node-list";
import { NodeDialog } from "@/components/nodes/node-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, Download } from "lucide-react";

export default function Nodes() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const stats = [
    { label: "总节点数", value: "1,247", change: "+12", color: "text-blue-400" },
    { label: "在线节点", value: "1,203", change: "+8", color: "text-green-400" },
    { label: "离线节点", value: "44", change: "-3", color: "text-red-400" },
    { label: "警告节点", value: "41", change: "+2", color: "text-yellow-400" }
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="节点管理" />
      
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-effect border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${stat.color}`}>
                      {stat.change} 本月变化
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color.replace('text-', 'bg-').replace('400', '500/20')} rounded-lg flex items-center justify-center`}>
                    <div className={`w-6 h-6 ${stat.color.replace('text-', 'bg-')} rounded-full`} />
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
              <CardTitle className="text-white">网络节点列表</CardTitle>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="搜索节点名称、IP地址..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400 w-64"
                  />
                </div>
                <Button variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                  <Filter className="w-4 h-4 mr-2" />
                  筛选
                </Button>
                <Button variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                  <Download className="w-4 h-4 mr-2" />
                  导出
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setSelectedNode(null);
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加节点
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                <TabsTrigger value="list" className="data-[state=active]:bg-blue-600">列表视图</TabsTrigger>
                <TabsTrigger value="groups" className="data-[state=active]:bg-blue-600">分组视图</TabsTrigger>
                <TabsTrigger value="map" className="data-[state=active]:bg-blue-600">地图视图</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list" className="mt-6">
                <NodeList 
                  searchTerm={searchTerm}
                  onNodeEdit={(node) => {
                    setSelectedNode(node);
                    setIsDialogOpen(true);
                  }}
                />
              </TabsContent>
              
              <TabsContent value="groups" className="mt-6">
                <div className="space-y-4">
                  {["核心网络", "边缘网络", "接入网络", "管理网络"].map((group) => (
                    <Card key={group} className="bg-slate-800/50 border-slate-600">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-lg">{group}</CardTitle>
                          <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {Math.floor(Math.random() * 200) + 50} 节点
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <div className="w-2 h-2 bg-green-400 rounded-full" />
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">Node-{group.slice(0,2)}-{index + 1}</p>
                                <p className="text-slate-400 text-xs">192.168.{index + 1}.1</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="map" className="mt-6">
                <div className="h-96 bg-slate-800/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-slate-600 rounded-full" />
                    </div>
                    <p className="text-slate-400">地图视图功能开发中...</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Node Dialog */}
        <NodeDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          node={selectedNode}
        />
      </main>
    </div>
  );
}

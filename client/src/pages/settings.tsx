import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  Network,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2
} from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    critical: true,
    warning: false,
    info: false
  });

  const [systemSettings, setSystemSettings] = useState({
    autoRefresh: true,
    refreshInterval: "30",
    maxLogSize: "1000",
    retentionDays: "90"
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="系统设置" />
      
      <main className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-700">
            <TabsTrigger value="general" className="data-[state=active]:bg-blue-600">常规设置</TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-blue-600">告警配置</TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-blue-600">网络配置</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-blue-600">安全设置</TabsTrigger>
            <TabsTrigger value="backup" className="data-[state=active]:bg-blue-600">备份恢复</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="glass-effect border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  系统参数
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">系统名称</Label>
                    <Input 
                      defaultValue="网络监测系统" 
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">版本号</Label>
                    <Input 
                      defaultValue="v1.0.0" 
                      disabled
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">自动刷新间隔 (秒)</Label>
                    <Select value={systemSettings.refreshInterval} onValueChange={(value) => 
                      setSystemSettings(prev => ({ ...prev, refreshInterval: value }))
                    }>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10秒</SelectItem>
                        <SelectItem value="30">30秒</SelectItem>
                        <SelectItem value="60">1分钟</SelectItem>
                        <SelectItem value="300">5分钟</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">最大日志条数</Label>
                    <Input 
                      value={systemSettings.maxLogSize}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, maxLogSize: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                
                <Separator className="bg-slate-600" />
                
                <div className="space-y-4">
                  <h4 className="text-white font-medium">功能开关</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div>
                        <Label className="text-slate-300">自动刷新</Label>
                        <p className="text-slate-400 text-sm">启用实时数据自动刷新</p>
                      </div>
                      <Switch 
                        checked={systemSettings.autoRefresh}
                        onCheckedChange={(checked) => 
                          setSystemSettings(prev => ({ ...prev, autoRefresh: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div>
                        <Label className="text-slate-300">AI诊断</Label>
                        <p className="text-slate-400 text-sm">启用AI智能诊断功能</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div>
                        <Label className="text-slate-300">拓扑动画</Label>
                        <p className="text-slate-400 text-sm">显示网络拓扑动画效果</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div>
                        <Label className="text-slate-300">暗色主题</Label>
                        <p className="text-slate-400 text-sm">使用暗色主题界面</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    重置
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    保存设置
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card className="glass-effect border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  告警配置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">CPU使用率阈值 (%)</Label>
                    <Input 
                      type="number" 
                      defaultValue="85" 
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">内存使用率阈值 (%)</Label>
                    <Input 
                      type="number" 
                      defaultValue="90" 
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">网络延迟阈值 (ms)</Label>
                    <Input 
                      type="number" 
                      defaultValue="50" 
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">丢包率阈值 (%)</Label>
                    <Input 
                      type="number" 
                      defaultValue="0.1" 
                      step="0.01"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <Separator className="bg-slate-600" />

                <div className="space-y-4">
                  <h4 className="text-white font-medium">通知设置</h4>
                  <div className="space-y-4">
                    {[
                      { key: "email", label: "邮件通知", desc: "通过邮件发送告警信息" },
                      { key: "browser", label: "浏览器通知", desc: "在浏览器中显示通知" },
                      { key: "critical", label: "严重告警", desc: "接收严重级别告警" },
                      { key: "warning", label: "警告告警", desc: "接收警告级别告警" },
                      { key: "info", label: "信息告警", desc: "接收信息级别告警" }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div>
                          <Label className="text-slate-300">{item.label}</Label>
                          <p className="text-slate-400 text-sm">{item.desc}</p>
                        </div>
                        <Switch 
                          checked={notifications[item.key as keyof typeof notifications]}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, [item.key]: checked }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">邮件配置</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">SMTP服务器</Label>
                      <Input 
                        placeholder="smtp.example.com" 
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">端口</Label>
                      <Input 
                        placeholder="587" 
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">用户名</Label>
                      <Input 
                        placeholder="username" 
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">密码</Label>
                      <Input 
                        type="password" 
                        placeholder="password" 
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                    测试配置
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    保存配置
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network" className="space-y-6">
            <Card className="glass-effect border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Network className="w-5 h-5 mr-2" />
                  网络配置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">监控端口范围</Label>
                    <Input 
                      defaultValue="1-65535" 
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">扫描间隔 (秒)</Label>
                    <Input 
                      type="number" 
                      defaultValue="60" 
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">连接超时 (秒)</Label>
                    <Input 
                      type="number" 
                      defaultValue="10" 
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">重试次数</Label>
                    <Input 
                      type="number" 
                      defaultValue="3" 
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <Separator className="bg-slate-600" />

                <div className="space-y-4">
                  <h4 className="text-white font-medium">SNMP配置</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">SNMP版本</Label>
                      <Select defaultValue="v2c">
                        <SelectTrigger className="bg-slate-700 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="v1">SNMPv1</SelectItem>
                          <SelectItem value="v2c">SNMPv2c</SelectItem>
                          <SelectItem value="v3">SNMPv3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">社区字符串</Label>
                      <Input 
                        defaultValue="public" 
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">网络发现</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div>
                        <Label className="text-slate-300">自动发现</Label>
                        <p className="text-slate-400 text-sm">自动发现网络中的新设备</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div>
                        <Label className="text-slate-300">拓扑自动更新</Label>
                        <p className="text-slate-400 text-sm">自动更新网络拓扑结构</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                    测试连接
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    保存配置
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="glass-effect border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  安全设置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">密码策略</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">最小密码长度</Label>
                      <Input 
                        type="number" 
                        defaultValue="8" 
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">密码有效期 (天)</Label>
                      <Input 
                        type="number" 
                        defaultValue="90" 
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "要求大写字母", desc: "密码必须包含大写字母" },
                      { label: "要求小写字母", desc: "密码必须包含小写字母" },
                      { label: "要求数字", desc: "密码必须包含数字" },
                      { label: "要求特殊字符", desc: "密码必须包含特殊字符" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div>
                          <Label className="text-slate-300">{item.label}</Label>
                          <p className="text-slate-400 text-sm">{item.desc}</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-slate-600" />

                <div className="space-y-4">
                  <h4 className="text-white font-medium">会话管理</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">会话超时 (分钟)</Label>
                      <Input 
                        type="number" 
                        defaultValue="30" 
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">最大登录尝试次数</Label>
                      <Input 
                        type="number" 
                        defaultValue="5" 
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">审计日志</h4>
                  <div className="space-y-4">
                    {[
                      { label: "登录日志", desc: "记录用户登录活动" },
                      { label: "操作日志", desc: "记录用户操作行为" },
                      { label: "配置变更", desc: "记录系统配置变更" },
                      { label: "安全事件", desc: "记录安全相关事件" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div>
                          <Label className="text-slate-300">{item.label}</Label>
                          <p className="text-slate-400 text-sm">{item.desc}</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    保存设置
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <Card className="glass-effect border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  备份恢复
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slate-800/50 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">数据备份</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">备份频率</Label>
                        <Select defaultValue="daily">
                          <SelectTrigger className="bg-slate-700 border-slate-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">每小时</SelectItem>
                            <SelectItem value="daily">每天</SelectItem>
                            <SelectItem value="weekly">每周</SelectItem>
                            <SelectItem value="monthly">每月</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">保留天数</Label>
                        <Input 
                          type="number" 
                          defaultValue="30" 
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Download className="w-4 h-4 mr-2" />
                        立即备份
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">数据恢复</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">选择备份文件</Label>
                        <Input 
                          type="file" 
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">恢复说明</Label>
                        <Textarea 
                          placeholder="请输入恢复原因..."
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <Upload className="w-4 h-4 mr-2" />
                        开始恢复
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">备份历史</h4>
                  <div className="space-y-2">
                    {[
                      { name: "backup_20240115_143210.sql", size: "15.2 MB", date: "2024-01-15 14:32:10" },
                      { name: "backup_20240114_143210.sql", size: "14.8 MB", date: "2024-01-14 14:32:10" },
                      { name: "backup_20240113_143210.sql", size: "14.5 MB", date: "2024-01-13 14:32:10" }
                    ].map((backup, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{backup.name}</p>
                          <p className="text-slate-400 text-sm">{backup.size} • {backup.date}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                            <Upload className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="bg-red-600 border-red-600 hover:bg-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
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

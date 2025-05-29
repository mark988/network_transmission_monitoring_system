import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Network, Shield, Brain, BarChart3, Bell, Users, Zap, Globe } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center space-y-8">
            {/* Logo and branding */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center animate-glow">
                  <Network className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-3xl font-bold text-white">网络监测系统</h1>
                  <p className="text-slate-400">Network Monitor Pro</p>
                </div>
              </div>
            </div>

            {/* Main headline */}
            <div className="space-y-4">
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                企业级网络监控解决方案
              </Badge>
              <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                大规模时变网络
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  传输监测系统
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                实时监控、智能分析、AI诊断 - 为您的网络基础设施提供全方位的可视化监控和智能运维能力
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-8">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
                onClick={() => window.location.href = '/api/login'}
              >
                立即开始监控
                <Zap className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-white mb-4">核心功能特性</h3>
          <p className="text-slate-400 text-lg">专为企业级网络环境设计的全方位监控解决方案</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Globe className="w-8 h-8" />,
              title: "实时拓扑视图",
              description: "可视化网络拓扑结构，实时显示节点状态和连接关系，支持交互式操作",
              color: "from-blue-500 to-cyan-400"
            },
            {
              icon: <BarChart3 className="w-8 h-8" />,
              title: "性能监控分析",
              description: "全面监控网络性能指标，包括带宽、延迟、丢包率等关键数据",
              color: "from-green-500 to-emerald-400"
            },
            {
              icon: <Brain className="w-8 h-8" />,
              title: "AI智能诊断",
              description: "基于机器学习的智能故障诊断，提供根因分析和解决建议",
              color: "from-purple-500 to-pink-400"
            },
            {
              icon: <Bell className="w-8 h-8" />,
              title: "智能告警系统",
              description: "多级告警策略，支持多种通知方式，确保关键事件及时响应",
              color: "from-orange-500 to-red-400"
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: "安全管理",
              description: "用户权限管理、操作审计、安全策略配置，保障系统安全",
              color: "from-indigo-500 to-blue-400"
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "多用户协作",
              description: "支持多角色用户管理，团队协作监控，提高运维效率",
              color: "from-teal-500 to-cyan-400"
            }
          ].map((feature, index) => (
            <Card key={index} className="glass-effect border-slate-700 hover:border-slate-600 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-slate-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-800/50 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "监控节点", value: "10,000+", icon: <Network className="w-6 h-6" /> },
              { label: "数据处理能力", value: "1TB/天", icon: <BarChart3 className="w-6 h-6" /> },
              { label: "响应时间", value: "<100ms", icon: <Zap className="w-6 h-6" /> },
              { label: "系统可用性", value: "99.99%", icon: <Shield className="w-6 h-6" /> }
            ].map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="flex justify-center text-blue-400 mb-2">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <Network className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold">网络监测系统</div>
                <div className="text-slate-400 text-sm">Network Monitor Pro</div>
              </div>
            </div>
            <div className="text-slate-400 text-sm">
              © 2024 网络监测系统. 保留所有权利.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { 
  Network,
  BarChart3,
  Server,
  Globe,
  Bell,
  Brain,
  Users,
  Settings,
  LogOut
} from "lucide-react";

const navigation = [
  { name: "监控总览", href: "/", icon: BarChart3 },
  { name: "拓扑视图", href: "/topology", icon: Globe },
  { name: "节点管理", href: "/nodes", icon: Server },
  { name: "数据分析", href: "/analytics", icon: BarChart3 },
  { name: "告警中心", href: "/alerts", icon: Bell, badge: "3" },
  { name: "AI诊断", href: "/ai-diagnosis", icon: Brain },
  { name: "用户管理", href: "/users", icon: Users },
  { name: "系统设置", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      {/* Logo and Branding */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <Network className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">网络监测系统</h1>
            <p className="text-xs text-slate-400">Network Monitor Pro</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
                {item.badge && (
                  <Badge className="ml-auto bg-red-500 text-white text-xs px-2 py-1">
                    {item.badge}
                  </Badge>
                )}
              </a>
            </Link>
          );
        })}
      </nav>
      
      {/* User Profile */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3 px-4 py-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.profileImageUrl || undefined} />
            <AvatarFallback className="bg-blue-500 text-white text-sm">
              {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "管"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user?.email || "系统管理员"
              }
            </p>
            <p className="text-xs text-slate-400 truncate">
              {user?.role === "admin" ? "超级管理员" : 
               user?.role === "operator" ? "操作员" : "观察者"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white transition-colors p-2"
            onClick={() => window.location.href = '/api/logout'}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings } from "lucide-react";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const currentTime = new Date().toLocaleString('zh-CN');

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <span>最后更新:</span>
            <span className="text-green-400">{currentTime}</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            className="relative p-2 text-slate-400 hover:text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0 min-w-0">
              3
            </Badge>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

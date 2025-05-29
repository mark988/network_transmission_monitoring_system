import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Send, User } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export function AiChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "检测到核心路由器Router-01出现轻微性能下降，建议检查以下几个方面：\n• CPU使用率当前86%，超过阈值\n• 内存占用78%，建议清理缓存\n• 端口eth0/1流量异常增长",
      timestamp: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "正在分析Router-01的流量模式...\n\n根据最近24小时的数据分析:\n• 流量峰值出现在14:00-16:00\n• 主要流量来源为192.168.1.0/24网段\n• 建议在低峰期进行负载均衡调整",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "刚刚";
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="glass-effect border-slate-700 h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-lg font-semibold text-white">AI智能诊断</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 text-sm">在线</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-[calc(100%-5rem)]">
        {/* Chat Messages */}
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex space-x-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
                {message.type === 'ai' && (
                  <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                      <Brain className="w-4 h-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                  <div className={`rounded-lg p-3 border max-w-sm ${
                    message.type === 'ai' 
                      ? 'bg-blue-600/20 border-blue-500/30 text-slate-200' 
                      : 'bg-slate-600/50 border-slate-500/30 text-slate-200 inline-block ml-auto'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {message.type === 'ai' ? 'AI助手' : '您'} • {formatTime(message.timestamp)}
                  </p>
                </div>

                {message.type === 'user' && (
                  <Avatar className="w-8 h-8 bg-blue-500">
                    <AvatarFallback className="bg-blue-500">
                      <User className="w-4 h-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Input Area */}
        <div className="p-6 border-t border-slate-700">
          <div className="relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="询问AI助手关于网络问题..."
              className="w-full bg-slate-700 border-slate-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-700/50 hover:bg-slate-600/50 border-slate-600 text-xs text-slate-300"
              onClick={() => setInputValue("网络健康检查")}
            >
              网络健康检查
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-700/50 hover:bg-slate-600/50 border-slate-600 text-xs text-slate-300"
              onClick={() => setInputValue("性能优化建议")}
            >
              性能优化建议
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

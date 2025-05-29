import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  Send, 
  User, 
  Loader2,
  MessageCircle,
  AlertCircle
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  isError?: boolean;
}

interface AiSession {
  id: string;
  query: string;
  response?: string;
  createdAt: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: recentSessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["/api/ai/sessions"],
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/chat", {
        message,
        context: {
          previousMessages: messages.slice(-5), // Send last 5 messages for context
        },
      });
      return response.json();
    },
    onSuccess: (data) => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    },
    onError: (error) => {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "抱歉，我现在无法回答您的问题。请稍后再试。",
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
      toast({
        title: "AI响应失败",
        description: "无法获取AI回复，请检查网络连接",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!inputValue.trim() || chatMutation.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    
    chatMutation.mutate(inputValue);
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

  const handleQuickAction = (action: string) => {
    setInputValue(action);
  };

  const loadSessionMessages = (session: AiSession) => {
    const sessionMessages: Message[] = [
      {
        id: `session-${session.id}-user`,
        type: "user",
        content: session.query,
        timestamp: new Date(session.createdAt),
      }
    ];

    if (session.response) {
      sessionMessages.push({
        id: `session-${session.id}-ai`,
        type: "ai",
        content: session.response,
        timestamp: new Date(session.createdAt),
      });
    }

    setMessages(sessionMessages);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          type: "ai",
          content: "您好！我是AI网络诊断助手。我可以帮您分析网络问题、提供优化建议，以及回答关于网络监控的问题。请告诉我您需要什么帮助？",
          timestamp: new Date(),
        }
      ]);
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-6">
        <div className="space-y-4 py-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex space-x-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
              {message.type === 'ai' && (
                <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                    <Brain className="w-4 h-4 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`flex-1 max-w-xs ${message.type === 'user' ? 'text-right' : ''}`}>
                <div className={`rounded-lg p-3 text-sm ${
                  message.type === 'ai' 
                    ? message.isError
                      ? 'bg-red-600/20 border border-red-500/30 text-red-200'
                      : 'bg-blue-600/20 border border-blue-500/30 text-slate-200'
                    : 'bg-slate-600/50 border border-slate-500/30 text-slate-200 inline-block ml-auto'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.isError && (
                    <div className="flex items-center mt-2 text-xs text-red-400">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      <span>AI服务暂时不可用</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {message.type === 'ai' ? 'AI助手' : '您'} • {formatTime(message.timestamp)}
                </p>
              </div>

              {message.type === 'user' && (
                <Avatar className="w-8 h-8 bg-blue-500 shrink-0">
                  <AvatarFallback className="bg-blue-500">
                    <User className="w-4 h-4 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex space-x-3">
              <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                  <Brain className="w-4 h-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  <span className="text-slate-300 text-sm">AI正在分析中...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="px-6 py-2 border-t border-slate-700">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            "网络健康检查",
            "性能优化建议",
            "故障诊断分析", 
            "流量异常检测"
          ].map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="bg-slate-700/50 hover:bg-slate-600/50 border-slate-600 text-xs text-slate-300 hover:text-white justify-start"
              onClick={() => handleQuickAction(action)}
              disabled={chatMutation.isPending}
            >
              {action}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="px-6 pb-6">
        <div className="relative">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="询问AI助手关于网络问题..."
            className="w-full bg-slate-700 border-slate-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={chatMutation.isPending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || chatMutation.isPending}
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 p-2"
          >
            {chatMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Recent Sessions Sidebar (if needed) */}
      {recentSessions && recentSessions.length > 0 && messages.length <= 1 && (
        <div className="px-6 pb-4">
          <h4 className="text-slate-300 text-sm font-medium mb-3">最近的对话</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {recentSessions.slice(0, 3).map((session: AiSession) => (
              <Card 
                key={session.id} 
                className="bg-slate-700/30 border-slate-600 cursor-pointer hover:bg-slate-600/30"
                onClick={() => loadSessionMessages(session)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start space-x-2">
                    <MessageCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-300 text-xs truncate">{session.query}</p>
                      <p className="text-slate-400 text-xs mt-1">
                        {formatTime(new Date(session.createdAt))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

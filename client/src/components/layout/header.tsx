import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Bell, Settings, User, Lock, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  title: string;
}

const userInfoSchema = z.object({
  firstName: z.string().min(1, "请输入姓名"),
  lastName: z.string().min(1, "请输入姓名"),
  email: z.string().email("请输入有效的邮箱地址"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "请输入当前密码"),
  newPassword: z.string().min(6, "新密码至少6位"),
  confirmPassword: z.string().min(6, "请确认新密码"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
});

type UserInfoForm = z.infer<typeof userInfoSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export function Header({ title }: HeaderProps) {
  const currentTime = new Date().toLocaleString('zh-CN');
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // 模拟通知数据
  const notifications = [
    {
      id: 1,
      type: "critical",
      title: "节点离线告警",
      message: "核心路由器 RT-001 已离线 5 分钟",
      time: "2分钟前",
      icon: AlertCircle,
    },
    {
      id: 2,
      type: "warning",
      title: "带宽使用率过高",
      message: "链路 LK-005 带宽使用率达到 85%",
      time: "10分钟前",
      icon: AlertCircle,
    },
    {
      id: 3,
      type: "info",
      title: "系统维护完成",
      message: "计划维护已完成，所有服务恢复正常",
      time: "1小时前",
      icon: CheckCircle,
    },
  ];

  const userForm = useForm<UserInfoForm>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      firstName: (user as any)?.firstName || "",
      lastName: (user as any)?.lastName || "",
      email: (user as any)?.email || "",
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: UserInfoForm) => {
      const response = await apiRequest("PUT", "/api/auth/user", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "用户信息更新成功",
        description: "您的个人信息已成功更新",
      });
      setShowUserDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: any) => {
      toast({
        title: "更新失败",
        description: error.message || "用户信息更新失败",
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordForm) => {
      const response = await apiRequest("POST", "/api/auth/change-password", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "密码修改成功",
        description: "您的密码已成功修改",
      });
      setShowPasswordDialog(false);
      passwordForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "密码修改失败",
        description: error.message || "密码修改失败",
        variant: "destructive",
      });
    },
  });

  const onUserSubmit = (data: UserInfoForm) => {
    updateUserMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordForm) => {
    changePasswordMutation.mutate(data);
  };

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
          {/* 通知铃铛 */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="relative p-2 text-slate-400 hover:text-white transition-colors"
              >
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0 min-w-0">
                  {notifications.length}
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-slate-800 border-slate-700" align="end">
              <div className="p-4 border-b border-slate-700">
                <h4 className="text-sm font-medium text-white">通知消息</h4>
                <p className="text-xs text-slate-400">您有 {notifications.length} 条未读消息</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <div key={notification.id} className="p-3 border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer">
                      <div className="flex items-start space-x-3">
                        <div className={`mt-0.5 ${
                          notification.type === "critical" ? "text-red-400" :
                          notification.type === "warning" ? "text-yellow-400" : "text-green-400"
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{notification.title}</p>
                          <p className="text-xs text-slate-400 mt-1">{notification.message}</p>
                          <div className="flex items-center mt-2">
                            <Clock className="w-3 h-3 text-slate-500 mr-1" />
                            <span className="text-xs text-slate-500">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-3 border-t border-slate-700">
                <Button variant="ghost" className="w-full text-xs text-slate-400 hover:text-white">
                  查看全部消息
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* 设置下拉菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-slate-800 border-slate-700" align="end">
              <DropdownMenuItem 
                className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                onClick={() => setShowUserDialog(true)}
              >
                <User className="w-4 h-4 mr-2" />
                用户信息
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                onClick={() => setShowPasswordDialog(true)}
              >
                <Lock className="w-4 h-4 mr-2" />
                修改密码
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 用户信息对话框 */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">用户信息</DialogTitle>
            <DialogDescription className="text-slate-400">
              修改您的个人信息
            </DialogDescription>
          </DialogHeader>
          <Form {...userForm}>
            <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
              <FormField
                control={userForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">名</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-slate-700 border-slate-600 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">姓</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-slate-700 border-slate-600 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">邮箱</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" className="bg-slate-700 border-slate-600 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowUserDialog(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  取消
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateUserMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {updateUserMutation.isPending ? "保存中..." : "保存"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* 修改密码对话框 */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">修改密码</DialogTitle>
            <DialogDescription className="text-slate-400">
              请输入当前密码和新密码
            </DialogDescription>
          </DialogHeader>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">当前密码</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" className="bg-slate-700 border-slate-600 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">新密码</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" className="bg-slate-700 border-slate-600 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">确认新密码</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" className="bg-slate-700 border-slate-600 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowPasswordDialog(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  取消
                </Button>
                <Button 
                  type="submit" 
                  disabled={changePasswordMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {changePasswordMutation.isPending ? "修改中..." : "修改密码"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </header>
  );
}

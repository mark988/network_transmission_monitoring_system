import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Network, RefreshCw, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  username: z.string().min(1, "请输入用户名"),
  password: z.string().min(6, "密码至少6位"),
  captcha: z.string().min(4, "请输入验证码"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      captcha: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      if (data.captcha.toLowerCase() !== captchaCode.toLowerCase()) {
        throw new Error("验证码错误");
      }
      
      const result = await apiRequest({
        url: "/api/auth/login",
        method: "POST",
        body: data,
      });
      return result;
    },
    onSuccess: () => {
      toast({
        title: "登录成功",
        description: "欢迎使用网络监测系统",
      });
      window.location.href = "/";
    },
    onError: (error: any) => {
      toast({
        title: "登录失败",
        description: error.message || "用户名或密码错误",
        variant: "destructive",
      });
      refreshCaptcha();
    },
  });

  function generateCaptcha(): string {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let result = "";
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  function refreshCaptcha() {
    setCaptchaCode(generateCaptcha());
    form.setValue("captcha", "");
  }

  function onSubmit(data: LoginForm) {
    loginMutation.mutate(data);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      
      <div className="relative w-full max-w-md">
        <Card className="glass-effect border-slate-700 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center animate-glow">
                <Network className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">网络监测系统</CardTitle>
              <CardDescription className="text-slate-400">Network Monitor Pro</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">用户名</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="请输入用户名"
                          className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">密码</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="请输入密码"
                            className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="captcha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">验证码</FormLabel>
                      <FormControl>
                        <div className="flex space-x-2">
                          <Input
                            {...field}
                            placeholder="请输入验证码"
                            className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
                          />
                          <div className="flex items-center space-x-2">
                            <div className="bg-slate-700 px-4 py-2 rounded border border-slate-600 text-white font-mono text-lg select-none min-w-[80px] text-center">
                              {captchaCode}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="border-slate-600 text-slate-400 hover:text-white hover:border-slate-400"
                              onClick={refreshCaptcha}
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "登录中..." : "登录"}
                </Button>
              </form>
            </Form>

            <div className="text-center">
              <p className="text-slate-400 text-sm">
                企业级网络传输监测系统
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
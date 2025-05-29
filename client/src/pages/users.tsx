import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Shield,
  Eye,
  Edit,
  Trash2,
  UserCheck
} from "lucide-react";

const userSchema = z.object({
  firstName: z.string().min(1, "名字不能为空"),
  lastName: z.string().min(1, "姓氏不能为空"),
  email: z.string().email("请输入有效的邮箱地址"),
  role: z.string().min(1, "请选择用户角色"),
});

type UserForm = z.infer<typeof userSchema>;

export default function UsersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  const form = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
    },
  });

  const onSubmit = (data: UserForm) => {
    console.log("User data:", data);
    setIsDialogOpen(false);
    form.reset();
  };

  const userStats = [
    { label: "总用户数", value: "24", icon: <Users className="w-5 h-5" />, color: "text-blue-400" },
    { label: "管理员", value: "3", icon: <Shield className="w-5 h-5" />, color: "text-red-400" },
    { label: "操作员", value: "8", icon: <UserCheck className="w-5 h-5" />, color: "text-yellow-400" },
    { label: "观察者", value: "13", icon: <Eye className="w-5 h-5" />, color: "text-green-400" },
  ];

  const users = [
    {
      id: "1",
      name: "张三",
      email: "zhangsan@company.com",
      role: "admin",
      status: "active",
      lastLogin: "2024-01-15 14:32",
      avatar: null
    },
    {
      id: "2",
      name: "李四",
      email: "lisi@company.com",
      role: "operator",
      status: "active",
      lastLogin: "2024-01-15 13:45",
      avatar: null
    },
    {
      id: "3",
      name: "王五",
      email: "wangwu@company.com",
      role: "viewer",
      status: "inactive",
      lastLogin: "2024-01-14 16:20",
      avatar: null
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "operator": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "viewer": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return "管理员";
      case "operator": return "操作员";
      case "viewer": return "观察者";
      default: return role;
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active" 
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-slate-500/20 text-slate-400 border-slate-500/30";
  };

  const getStatusLabel = (status: string) => {
    return status === "active" ? "活跃" : "非活跃";
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="用户管理" />
      
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {userStats.map((stat, index) => (
            <Card key={index} className="glass-effect border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-${stat.color.split('-')[1]}-500/20 rounded-lg flex items-center justify-center`}>
                    <div className={stat.color}>
                      {stat.icon}
                    </div>
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
              <CardTitle className="text-white">用户列表</CardTitle>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="搜索用户..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400 w-64"
                  />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-32 bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有角色</SelectItem>
                    <SelectItem value="admin">管理员</SelectItem>
                    <SelectItem value="operator">操作员</SelectItem>
                    <SelectItem value="viewer">观察者</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                  <Filter className="w-4 h-4 mr-2" />
                  筛选
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      添加用户
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">添加新用户</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-300">名字</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    className="bg-slate-700 border-slate-600 text-white"
                                    placeholder="请输入名字"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-300">姓氏</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    className="bg-slate-700 border-slate-600 text-white"
                                    placeholder="请输入姓氏"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-300">邮箱</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="email"
                                  className="bg-slate-700 border-slate-600 text-white"
                                  placeholder="请输入邮箱地址"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-300">角色</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-slate-700 border-slate-600">
                                    <SelectValue placeholder="选择用户角色" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="admin">管理员</SelectItem>
                                  <SelectItem value="operator">操作员</SelectItem>
                                  <SelectItem value="viewer">观察者</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsDialogOpen(false)}
                            className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                          >
                            取消
                          </Button>
                          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            添加用户
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <Card key={user.id} className="bg-slate-800/50 border-slate-600">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.avatar || undefined} />
                          <AvatarFallback className="bg-blue-500 text-white">
                            {user.name.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-white font-medium">{user.name}</h4>
                          <p className="text-slate-400 text-sm">{user.email}</p>
                          <p className="text-slate-500 text-xs">最后登录: {user.lastLogin}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className={getRoleColor(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(user.status)}>
                          {getStatusLabel(user.status)}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

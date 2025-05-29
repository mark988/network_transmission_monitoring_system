import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const nodeSchema = z.object({
  name: z.string().min(1, "节点名称不能为空"),
  type: z.enum(["router", "switch", "server", "endpoint"], {
    required_error: "请选择节点类型",
  }),
  ipAddress: z.string().min(1, "IP地址不能为空").regex(
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    "请输入有效的IP地址"
  ),
  macAddress: z.string().optional(),
  location: z.string().optional(),
  groupId: z.string().optional(),
});

type NodeForm = z.infer<typeof nodeSchema>;

interface NetworkNode {
  id: string;
  name: string;
  type: string;
  ipAddress: string;
  macAddress?: string;
  location?: string;
  groupId?: string;
}

interface NetworkGroup {
  id: string;
  name: string;
}

interface NodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  node?: NetworkNode | null;
}

export function NodeDialog({ isOpen, onClose, node }: NodeDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<NodeForm>({
    resolver: zodResolver(nodeSchema),
    defaultValues: {
      name: "",
      type: "router",
      ipAddress: "",
      macAddress: "",
      location: "",
      groupId: "",
    },
  });

  const { data: groups } = useQuery({
    queryKey: ["/api/groups"],
    enabled: isOpen,
  });

  const createNodeMutation = useMutation({
    mutationFn: async (data: NodeForm) => {
      return await apiRequest("POST", "/api/nodes", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nodes"] });
      toast({
        title: "节点创建成功",
        description: "新的网络节点已添加到系统中",
      });
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "创建失败",
        description: "创建节点时发生错误，请检查输入信息",
        variant: "destructive",
      });
    },
  });

  const updateNodeMutation = useMutation({
    mutationFn: async (data: NodeForm) => {
      if (!node) throw new Error("No node to update");
      return await apiRequest("PUT", `/api/nodes/${node.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nodes"] });
      toast({
        title: "节点更新成功",
        description: "节点信息已成功更新",
      });
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "更新失败",
        description: "更新节点时发生错误，请检查输入信息",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (node) {
      form.reset({
        name: node.name,
        type: node.type as "router" | "switch" | "server" | "endpoint",
        ipAddress: node.ipAddress,
        macAddress: node.macAddress || "",
        location: node.location || "",
        groupId: node.groupId || "",
      });
    } else {
      form.reset({
        name: "",
        type: "router",
        ipAddress: "",
        macAddress: "",
        location: "",
        groupId: "",
      });
    }
  }, [node, form]);

  const onSubmit = (data: NodeForm) => {
    const cleanData = {
      ...data,
      macAddress: data.macAddress || undefined,
      location: data.location || undefined,
      groupId: data.groupId || undefined,
    };

    if (node) {
      updateNodeMutation.mutate(cleanData);
    } else {
      createNodeMutation.mutate(cleanData);
    }
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  const isLoading = createNodeMutation.isPending || updateNodeMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            {node ? "编辑网络节点" : "添加网络节点"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">节点名称</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="例如: Core-Router-01"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">节点类型</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="选择节点类型" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="router">路由器</SelectItem>
                      <SelectItem value="switch">交换机</SelectItem>
                      <SelectItem value="server">服务器</SelectItem>
                      <SelectItem value="endpoint">终端设备</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ipAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">IP地址</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="例如: 192.168.1.1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="macAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">MAC地址（可选）</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="例如: 00:11:22:33:44:55"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">位置（可选）</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="例如: 机房A-机柜01"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {groups && groups.length > 0 && (
              <FormField
                control={form.control}
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">所属分组（可选）</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-700 border-slate-600">
                          <SelectValue placeholder="选择分组" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">无分组</SelectItem>
                        {groups.map((group: NetworkGroup) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                disabled={isLoading}
              >
                取消
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "保存中..." : node ? "更新节点" : "添加节点"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

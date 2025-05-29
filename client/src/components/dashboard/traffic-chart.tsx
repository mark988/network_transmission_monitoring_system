import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export function TrafficChart() {
  const { data: trafficData } = useQuery({
    queryKey: ["/api/dashboard/traffic"],
    refetchInterval: 30000,
  });

  // Fallback data for when API data is not available
  const defaultData = [
    { time: "00:00", inbound: 45, outbound: 35, total: 80 },
    { time: "04:00", inbound: 38, outbound: 32, total: 70 },
    { time: "08:00", inbound: 65, outbound: 58, total: 123 },
    { time: "12:00", inbound: 85, outbound: 72, total: 157 },
    { time: "16:00", inbound: 95, outbound: 82, total: 177 },
    { time: "20:00", inbound: 88, outbound: 78, total: 166 },
    { time: "24:00", inbound: 67, outbound: 58, total: 125 }
  ];

  const data = trafficData || defaultData;

  return (
    <Card className="glass-effect border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-lg font-semibold text-white">网络流量趋势</CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
          >
            1小时
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="bg-slate-600 hover:bg-slate-500 text-white text-xs px-3 py-1 border-slate-600"
          >
            24小时
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="bg-slate-600 hover:bg-slate-500 text-white text-xs px-3 py-1 border-slate-600"
          >
            7天
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--card-foreground))'
                }}
                labelStyle={{ color: 'hsl(var(--card-foreground))' }}
              />
              <Area 
                type="monotone" 
                dataKey="inbound" 
                stackId="1" 
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary))" 
                fillOpacity={0.3}
                name="入站流量 (Mbps)" 
              />
              <Area 
                type="monotone" 
                dataKey="outbound" 
                stackId="1" 
                stroke="hsl(var(--chart-2))" 
                fill="hsl(var(--chart-2))" 
                fillOpacity={0.3}
                name="出站流量 (Mbps)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

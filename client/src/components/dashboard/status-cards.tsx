import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { 
  Server, 
  Link, 
  AlertTriangle, 
  Clock 
} from "lucide-react";

export function StatusCards() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const cards = [
    {
      title: "网络节点",
      value: stats?.totalNodes || "0",
      change: stats?.nodeGrowth || "+0",
      changeText: "本月新增",
      icon: <Server className="w-6 h-6" />,
      color: "blue",
      isPositive: true
    },
    {
      title: "活跃连接",
      value: stats?.activeConnections || "0",
      change: stats?.connectionGrowth || "+0%",
      changeText: "较昨日",
      icon: <Link className="w-6 h-6" />,
      color: "cyan",
      isPositive: true
    },
    {
      title: "告警数量",
      value: stats?.alerts || "0",
      change: stats?.criticalAlerts || "0",
      changeText: "严重告警",
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "red",
      isPositive: false
    },
    {
      title: "平均时延",
      value: stats?.avgLatency || "0ms",
      change: stats?.latencyImprovement || "0ms",
      changeText: "优化",
      icon: <Clock className="w-6 h-6" />,
      color: "green",
      isPositive: true
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "bg-blue-500/20",
        text: "text-blue-400",
        icon: "text-blue-400"
      },
      cyan: {
        bg: "bg-cyan-500/20", 
        text: "text-cyan-400",
        icon: "text-cyan-400"
      },
      red: {
        bg: "bg-red-500/20",
        text: "text-red-400", 
        icon: "text-red-400"
      },
      green: {
        bg: "bg-green-500/20",
        text: "text-green-400",
        icon: "text-green-400"
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const colorClasses = getColorClasses(card.color);
        return (
          <Card 
            key={index} 
            className="glass-effect border-slate-700 hover:bg-slate-700/50 transition-all duration-300 transform hover:scale-105"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">{card.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                  <p className={`text-sm mt-1 ${card.isPositive ? colorClasses.text : "text-red-400"}`}>
                    {card.isPositive && card.change.startsWith('+') ? (
                      <span className="inline-flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l5-5 5 5M7 7l5 5 5-5" />
                        </svg>
                        {card.change}
                      </span>
                    ) : card.isPositive && card.change.startsWith('-') ? (
                      <span className="inline-flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5-5-5M17 7l-5 5-5-5" />
                        </svg>
                        {card.change}
                      </span>
                    ) : (
                      <span className="inline-flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {card.change}
                      </span>
                    )}
                    <span className="ml-1">{card.changeText}</span>
                  </p>
                </div>
                <div className={`w-12 h-12 ${colorClasses.bg} rounded-lg flex items-center justify-center`}>
                  <div className={colorClasses.icon}>
                    {card.icon}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

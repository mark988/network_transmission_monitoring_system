import { Header } from "@/components/layout/header";
import { StatusCards } from "@/components/dashboard/status-cards";
import { NetworkTopology } from "@/components/dashboard/network-topology";
import { AiChat } from "@/components/dashboard/ai-chat";
import { TrafficChart } from "@/components/dashboard/traffic-chart";
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics";
import { RecentAlerts } from "@/components/dashboard/recent-alerts";
import { TopPerformers } from "@/components/dashboard/top-performers";

export default function Dashboard() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="监控总览" />
      
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Status Cards */}
        <StatusCards />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <NetworkTopology />
          </div>
          <div>
            <AiChat />
          </div>
        </div>

        {/* Charts and Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrafficChart />
          <PerformanceMetrics />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentAlerts />
          <TopPerformers />
        </div>
      </main>
    </div>
  );
}

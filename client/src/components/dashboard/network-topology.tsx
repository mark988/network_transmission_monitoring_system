import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Maximize, Expand } from "lucide-react";

export function NetworkTopology() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <Card className="glass-effect border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-lg font-semibold text-white">网络拓扑视图</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isPlaying ? "实时监控" : "开始监控"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-slate-600 hover:bg-slate-500 text-white border-slate-600"
          >
            <Expand className="w-4 h-4 mr-1" />
            全屏
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative h-96 bg-slate-800/50 rounded-lg overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 800 400">
            {/* Define filters for glow effects */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Connection lines with animation */}
            <g className="connection-lines">
              <line x1="100" y1="100" x2="300" y2="100" className="connection-line" />
              <line x1="300" y1="100" x2="500" y2="100" className="connection-line" />
              <line x1="500" y1="100" x2="700" y2="100" className="connection-line" />
              <line x1="300" y1="100" x2="300" y2="250" className="connection-line" />
              <line x1="500" y1="100" x2="500" y2="250" className="connection-line" />
              <line x1="200" y1="250" x2="400" y2="250" className="connection-line" />
              <line x1="400" y1="250" x2="600" y2="250" className="connection-line" />
            </g>
            
            {/* Data flow indicators */}
            <g className="data-flows">
              <line x1="100" y1="105" x2="300" y2="105" className="data-flow" />
              <line x1="300" y1="105" x2="500" y2="105" className="data-flow" />
            </g>
            
            {/* Network nodes */}
            {/* Core router */}
            <g className="network-node cursor-pointer" filter="url(#glow)">
              <circle cx="400" cy="100" r="20" fill="hsl(var(--primary))" />
              <text x="400" y="106" textAnchor="middle" fill="white" fontSize="12">
                核心
              </text>
              <text x="400" y="140" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="10">
                Router-01
              </text>
            </g>
            
            {/* Edge routers */}
            <g className="network-node cursor-pointer" filter="url(#glow)">
              <circle cx="100" cy="100" r="16" fill="hsl(var(--chart-3))" />
              <text x="100" y="106" textAnchor="middle" fill="white" fontSize="10">边缘</text>
              <text x="100" y="130" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">
                Edge-01
              </text>
            </g>
            
            <g className="network-node cursor-pointer" filter="url(#glow)">
              <circle cx="700" cy="100" r="16" fill="hsl(var(--chart-3))" />
              <text x="700" y="106" textAnchor="middle" fill="white" fontSize="10">边缘</text>
              <text x="700" y="130" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">
                Edge-02
              </text>
            </g>
            
            {/* Switches */}
            <g className="network-node cursor-pointer" filter="url(#glow)">
              <rect x="285" y="235" width="30" height="30" rx="4" fill="hsl(var(--chart-2))" />
              <text x="300" y="255" textAnchor="middle" fill="white" fontSize="10">SW</text>
              <text x="300" y="280" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">
                Switch-01
              </text>
            </g>
            
            <g className="network-node cursor-pointer" filter="url(#glow)">
              <rect x="485" y="235" width="30" height="30" rx="4" fill="hsl(var(--chart-2))" />
              <text x="500" y="255" textAnchor="middle" fill="white" fontSize="10">SW</text>
              <text x="500" y="280" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">
                Switch-02
              </text>
            </g>
            
            {/* End devices */}
            <g className="network-node cursor-pointer" filter="url(#glow)">
              <rect x="185" y="335" width="30" height="20" rx="2" fill="hsl(var(--chart-4))" />
              <text x="200" y="350" textAnchor="middle" fill="white" fontSize="8">PC</text>
              <text x="200" y="370" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">
                Client-01
              </text>
            </g>
            
            <g className="network-node cursor-pointer" filter="url(#glow)">
              <rect x="585" y="335" width="30" height="20" rx="2" fill="hsl(var(--chart-4))" />
              <text x="600" y="350" textAnchor="middle" fill="white" fontSize="8">PC</text>
              <text x="600" y="370" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">
                Client-02
              </text>
            </g>
          </svg>
          
          {/* Status overlay */}
          <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-green-400 rounded-full status-indicator" />
              <span className="text-slate-300">正常: 1,203</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-yellow-400 rounded-full" />
              <span className="text-slate-300">警告: 41</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-red-400 rounded-full" />
              <span className="text-slate-300">故障: 3</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useState, useCallback, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface Node {
  id: string;
  name: string;
  type: "router" | "switch" | "server" | "endpoint";
  x: number;
  y: number;
  status: "online" | "warning" | "offline";
}

interface Connection {
  id: string;
  source: string;
  target: string;
  status: "active" | "inactive" | "degraded";
}

interface TopologyCanvasProps {
  onNodeSelect?: (nodeId: string | null) => void;
  isPlaying?: boolean;
  zoomLevel?: number;
  layout?: string;
  animationSpeed?: number;
  showDataFlow?: boolean;
  activeFilters?: string[];
}

export function TopologyCanvas({ 
  onNodeSelect, 
  isPlaying = true, 
  zoomLevel = 1, 
  layout = "force",
  animationSpeed = 5,
  showDataFlow = true,
  activeFilters = []
}: TopologyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [animationFrame, setAnimationFrame] = useState(0);

  const nodes: Node[] = [
    { id: "core-1", name: "Core-Router-01", type: "router", x: 400, y: 100, status: "online" },
    { id: "edge-1", name: "Edge-01", type: "router", x: 100, y: 100, status: "online" },
    { id: "edge-2", name: "Edge-02", type: "router", x: 700, y: 100, status: "warning" },
    { id: "switch-1", name: "Switch-01", type: "switch", x: 300, y: 250, status: "online" },
    { id: "switch-2", name: "Switch-02", type: "switch", x: 500, y: 250, status: "online" },
    { id: "server-1", name: "Server-01", type: "server", x: 200, y: 350, status: "online" },
    { id: "server-2", name: "Server-02", type: "server", x: 600, y: 350, status: "online" },
    { id: "client-1", name: "Client-01", type: "endpoint", x: 150, y: 450, status: "online" },
    { id: "client-2", name: "Client-02", type: "endpoint", x: 650, y: 450, status: "online" },
  ];

  const connections: Connection[] = [
    { id: "1", source: "edge-1", target: "core-1", status: "active" },
    { id: "2", source: "core-1", target: "edge-2", status: "active" },
    { id: "3", source: "core-1", target: "switch-1", status: "active" },
    { id: "4", source: "core-1", target: "switch-2", status: "active" },
    { id: "5", source: "switch-1", target: "server-1", status: "active" },
    { id: "6", source: "switch-2", target: "server-2", status: "active" },
    { id: "7", source: "server-1", target: "client-1", status: "active" },
    { id: "8", source: "server-2", target: "client-2", status: "active" },
  ];

  const getNodeColor = (type: string, status: string) => {
    const baseColors = {
      router: status === "warning" ? "#f59e0b" : "#3b82f6",
      switch: "#06b6d4",
      server: "#10b981",
      endpoint: "#8b5cf6",
    };
    return baseColors[type as keyof typeof baseColors] || "#6b7280";
  };

  const getConnectionColor = (status: string) => {
    switch (status) {
      case "active": return "#3b82f6";
      case "degraded": return "#f59e0b";
      case "inactive": return "#6b7280";
      default: return "#6b7280";
    }
  };

  const drawNode = (ctx: CanvasRenderingContext2D, node: Node) => {
    const { x, y, type, name, status } = node;
    const isSelected = selectedNode === node.id;
    
    // Draw glow effect if selected
    if (isSelected) {
      ctx.shadowColor = getNodeColor(type, status);
      ctx.shadowBlur = 20;
    }

    // Draw node based on type
    ctx.fillStyle = getNodeColor(type, status);
    ctx.strokeStyle = isSelected ? "#ffffff" : "transparent";
    ctx.lineWidth = 2;

    if (type === "router") {
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    } else if (type === "switch") {
      ctx.fillRect(x - 15, y - 15, 30, 30);
      ctx.strokeRect(x - 15, y - 15, 30, 30);
    } else if (type === "server") {
      ctx.fillRect(x - 12, y - 18, 24, 36);
      ctx.strokeRect(x - 12, y - 18, 24, 36);
    } else {
      ctx.fillRect(x - 10, y - 8, 20, 16);
      ctx.strokeRect(x - 10, y - 8, 20, 16);
    }

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw status indicator
    ctx.fillStyle = status === "online" ? "#10b981" : status === "warning" ? "#f59e0b" : "#ef4444";
    ctx.beginPath();
    ctx.arc(x + 15, y - 15, 4, 0, 2 * Math.PI);
    ctx.fill();

    // Draw label
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(name, x, y + 35);
  };

  const drawConnection = (ctx: CanvasRenderingContext2D, connection: Connection) => {
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);
    
    if (!sourceNode || !targetNode) return;

    ctx.strokeStyle = getConnectionColor(connection.status);
    ctx.lineWidth = 2;
    ctx.setLineDash([]);

    // Draw static connection line
    ctx.beginPath();
    ctx.moveTo(sourceNode.x, sourceNode.y);
    ctx.lineTo(targetNode.x, targetNode.y);
    ctx.stroke();

    // Draw animated data flow if enabled and playing
    if (showDataFlow && isPlaying && connection.status === "active") {
      drawDataFlow(ctx, sourceNode, targetNode);
    }
  };

  const drawDataFlow = (ctx: CanvasRenderingContext2D, source: Node, target: Node) => {
    const distance = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
    const speed = animationSpeed * 2;
    const dotSpacing = 40;
    const numDots = Math.floor(distance / dotSpacing);
    
    for (let i = 0; i < numDots; i++) {
      const offset = (animationFrame * speed + i * dotSpacing) % distance;
      const progress = offset / distance;
      
      const x = source.x + (target.x - source.x) * progress;
      const y = source.y + (target.y - source.y) * progress;
      
      // Direction indicator (arrow)
      ctx.fillStyle = "#60a5fa";
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
      
      // Arrow direction
      const angle = Math.atan2(target.y - source.y, target.x - source.x);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.moveTo(6, 0);
      ctx.lineTo(-2, -3);
      ctx.lineTo(-2, 3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Apply zoom and centering
    ctx.save();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.translate(centerX, centerY);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.translate(-centerX, -centerY);

    // Clear canvas
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply layout positioning
    const layoutNodes = applyLayout(nodes, layout);

    // Draw connections first
    connections.forEach(connection => {
      drawConnection(ctx, connection);
    });

    // Draw nodes
    layoutNodes.forEach(node => {
      // Apply filters
      const typeFilter = ["路由器", "交换机", "服务器", "终端"];
      const statusFilter = ["活跃", "闲置", "故障"];
      
      const nodeTypeMap: { [key: string]: string } = {
        "router": "路由器",
        "switch": "交换机", 
        "server": "服务器",
        "endpoint": "终端"
      };
      
      const nodeStatusMap: { [key: string]: string } = {
        "online": "活跃",
        "warning": "闲置",
        "offline": "故障"
      };

      const shouldShow = (activeFilters.length === 0) || 
        activeFilters.includes(nodeTypeMap[node.type]) ||
        activeFilters.includes(nodeStatusMap[node.status]);

      if (shouldShow) {
        drawNode(ctx, node);
      }
    });

    ctx.restore();
  };

  const applyLayout = (nodes: Node[], layoutType: string): Node[] => {
    const layoutNodes = [...nodes];
    const centerX = 400;
    const centerY = 300;
    
    switch (layoutType) {
      case "hierarchical":
        // Arrange in layers
        layoutNodes.forEach((node, index) => {
          const layer = node.type === "router" ? 0 : 
                       node.type === "switch" ? 1 : 
                       node.type === "server" ? 2 : 3;
          layoutNodes[index] = {
            ...node,
            x: 100 + (index % 3) * 200,
            y: 100 + layer * 100
          };
        });
        break;
        
      case "circular":
        // Arrange in circle
        layoutNodes.forEach((node, index) => {
          const angle = (index / layoutNodes.length) * 2 * Math.PI;
          const radius = 150;
          layoutNodes[index] = {
            ...node,
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius
          };
        });
        break;
        
      case "grid":
        // Arrange in grid
        const cols = 3;
        layoutNodes.forEach((node, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;
          layoutNodes[index] = {
            ...node,
            x: 150 + col * 200,
            y: 100 + row * 120
          };
        });
        break;
        
      default: // force layout - keep original positions
        break;
    }
    
    return layoutNodes;
  };

  // Animation loop
  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      drawCanvas();
      if (isPlaying) {
        setAnimationFrame(prev => prev + 1);
      }
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPlaying, zoomLevel, layout, animationSpeed, showDataFlow, activeFilters]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections first (behind nodes)
    connections.forEach(connection => drawConnection(ctx, connection));

    // Draw nodes
    nodes.forEach(node => drawNode(ctx, node));
  }, [selectedNode]);

  const getClickedNode = (x: number, y: number): string | null => {
    for (const node of nodes) {
      const distance = Math.sqrt(
        Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2)
      );
      if (distance <= 25) { // Click tolerance
        return node.id;
      }
    }
    return null;
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedNodeId = getClickedNode(x, y);
    setSelectedNode(clickedNodeId);
    onNodeSelect?.(clickedNodeId);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedNodeId = getClickedNode(x, y);
    if (clickedNodeId) {
      setIsDragging(true);
      const node = nodes.find(n => n.id === clickedNodeId);
      if (node) {
        setDragOffset({ x: x - node.x, y: y - node.y });
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedNode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const nodeIndex = nodes.findIndex(n => n.id === selectedNode);
    if (nodeIndex !== -1) {
      nodes[nodeIndex].x = x - dragOffset.x;
      nodes[nodeIndex].y = y - dragOffset.y;
      draw();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 500;

    // Initial draw
    draw();
  }, [draw]);

  return (
    <div className="w-full h-full bg-slate-800/50 rounded-lg overflow-hidden relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 space-y-2">
        <div className="text-white text-sm font-medium mb-2">图例</div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-4 h-4 bg-blue-500 rounded-full" />
          <span className="text-slate-300">路由器</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-4 h-4 bg-cyan-500 rounded" />
          <span className="text-slate-300">交换机</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span className="text-slate-300">服务器</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-4 h-4 bg-purple-500 rounded" />
          <span className="text-slate-300">终端</span>
        </div>
      </div>

      {/* Node Info */}
      {selectedNode && (
        <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3">
          <div className="text-white text-sm font-medium">
            {nodes.find(n => n.id === selectedNode)?.name}
          </div>
          <div className="text-slate-400 text-xs">
            {nodes.find(n => n.id === selectedNode)?.type}
          </div>
        </div>
      )}
    </div>
  );
}

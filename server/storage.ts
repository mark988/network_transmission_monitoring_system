import {
  users,
  networkNodes,
  networkGroups,
  networkConnections,
  performanceMetrics,
  alerts,
  aiDiagnosticSessions,
  topologySnapshots,
  type User,
  type UpsertUser,
  type NetworkNode,
  type InsertNetworkNode,
  type NetworkGroup,
  type InsertNetworkGroup,
  type NetworkConnection,
  type InsertNetworkConnection,
  type PerformanceMetric,
  type InsertPerformanceMetric,
  type Alert,
  type InsertAlert,
  type AiDiagnosticSession,
  type InsertAiDiagnosticSession,
  type TopologySnapshot,
  type InsertTopologySnapshot,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Dashboard operations
  getDashboardStats(): Promise<any>;
  
  // Network node operations
  getNetworkNodes(): Promise<NetworkNode[]>;
  getNetworkNode(id: string): Promise<NetworkNode | undefined>;
  createNetworkNode(node: InsertNetworkNode): Promise<NetworkNode>;
  updateNetworkNode(id: string, node: Partial<InsertNetworkNode>): Promise<NetworkNode | undefined>;
  deleteNetworkNode(id: string): Promise<boolean>;
  
  // Network group operations
  getNetworkGroups(): Promise<NetworkGroup[]>;
  createNetworkGroup(group: InsertNetworkGroup): Promise<NetworkGroup>;
  
  // Network connection operations
  getNetworkConnections(): Promise<NetworkConnection[]>;
  createNetworkConnection(connection: InsertNetworkConnection): Promise<NetworkConnection>;
  
  // Performance metrics operations
  getPerformanceMetrics(nodeId?: string, timeRange?: string): Promise<PerformanceMetric[]>;
  recordPerformanceMetric(metric: InsertPerformanceMetric): Promise<PerformanceMetric>;
  
  // Alert operations
  getAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  acknowledgeAlert(id: string, acknowledgedBy: string): Promise<Alert | undefined>;
  
  // AI diagnostic operations
  createAiDiagnosticSession(session: InsertAiDiagnosticSession): Promise<AiDiagnosticSession>;
  getAiDiagnosticSessions(userId: string): Promise<AiDiagnosticSession[]>;
  
  // Topology operations
  createTopologySnapshot(snapshot: InsertTopologySnapshot): Promise<TopologySnapshot>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Dashboard operations
  async getDashboardStats(): Promise<any> {
    try {
      // Get total nodes count
      const [totalNodesResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(networkNodes);
      
      // Get online nodes count
      const [onlineNodesResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(networkNodes)
        .where(eq(networkNodes.status, 'online'));
      
      // Get active alerts count
      const [activeAlertsResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(alerts)
        .where(eq(alerts.status, 'active'));
      
      // Get critical alerts count
      const [criticalAlertsResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(alerts)
        .where(and(
          eq(alerts.status, 'active'),
          eq(alerts.severity, 'critical')
        ));

      return {
        totalNodes: totalNodesResult.count.toString(),
        nodeGrowth: "+12", // Could be calculated from historical data
        activeConnections: onlineNodesResult.count.toString(),
        connectionGrowth: "+5.2%", // Could be calculated from historical data
        alerts: activeAlertsResult.count.toString(),
        criticalAlerts: criticalAlertsResult.count.toString(),
        avgLatency: "24ms", // Could be calculated from performance metrics
        latencyImprovement: "-3ms", // Could be calculated from historical data
      };
    } catch (error) {
      console.error("Error getting dashboard stats:", error);
      return {
        totalNodes: "0",
        nodeGrowth: "+0",
        activeConnections: "0", 
        connectionGrowth: "+0%",
        alerts: "0",
        criticalAlerts: "0",
        avgLatency: "0ms",
        latencyImprovement: "0ms",
      };
    }
  }

  // Network node operations
  async getNetworkNodes(): Promise<NetworkNode[]> {
    const nodes = await db.select().from(networkNodes).orderBy(desc(networkNodes.createdAt));
    
    // If no nodes exist, create some sample network infrastructure data
    if (nodes.length === 0) {
      const sampleNodes = [
        {
          name: "Core-Router-01",
          ipAddress: "192.168.1.1",
          type: "router" as const,
          status: "online" as const,
          location: "数据中心A栋",
          description: "核心路由器，负责主要流量转发"
        },
        {
          name: "Edge-Switch-02",
          ipAddress: "192.168.1.10",
          type: "switch" as const,
          status: "online" as const,
          location: "数据中心B栋",
          description: "边缘交换机，连接办公网络"
        },
        {
          name: "Web-Server-01",
          ipAddress: "192.168.1.100",
          type: "server" as const,
          status: "online" as const,
          location: "服务器机房1",
          description: "Web应用服务器"
        },
        {
          name: "DB-Server-Primary",
          ipAddress: "192.168.1.200",
          type: "server" as const,
          status: "warning" as const,
          location: "服务器机房2",
          description: "主数据库服务器"
        },
        {
          name: "Backup-Router-01",
          ipAddress: "192.168.1.5",
          type: "router" as const,
          status: "offline" as const,
          location: "数据中心A栋",
          description: "备用路由器，故障转移设备"
        },
        {
          name: "Access-Switch-03",
          ipAddress: "192.168.1.15",
          type: "switch" as const,
          status: "online" as const,
          location: "办公楼3层",
          description: "接入层交换机"
        },
        {
          name: "Load-Balancer-01",
          ipAddress: "192.168.1.50",
          type: "server" as const,
          status: "online" as const,
          location: "DMZ区域",
          description: "负载均衡器"
        },
        {
          name: "Firewall-Gateway",
          ipAddress: "192.168.1.254",
          type: "router" as const,
          status: "online" as const,
          location: "网络边界",
          description: "防火墙网关设备"
        }
      ];

      await db.insert(networkNodes).values(sampleNodes);
      
      return await db.select().from(networkNodes).orderBy(desc(networkNodes.createdAt));
    }
    
    return nodes;
  }

  async getNetworkNode(id: string): Promise<NetworkNode | undefined> {
    const [node] = await db.select().from(networkNodes).where(eq(networkNodes.id, id));
    return node;
  }

  async createNetworkNode(nodeData: InsertNetworkNode): Promise<NetworkNode> {
    const [node] = await db
      .insert(networkNodes)
      .values({
        ...nodeData,
        status: nodeData.status || 'unknown',
      })
      .returning();
    return node;
  }

  async updateNetworkNode(id: string, nodeData: Partial<InsertNetworkNode>): Promise<NetworkNode | undefined> {
    const [node] = await db
      .update(networkNodes)
      .set({
        ...nodeData,
        updatedAt: new Date(),
      })
      .where(eq(networkNodes.id, id))
      .returning();
    return node;
  }

  async deleteNetworkNode(id: string): Promise<boolean> {
    const result = await db.delete(networkNodes).where(eq(networkNodes.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Network group operations
  async getNetworkGroups(): Promise<NetworkGroup[]> {
    return await db.select().from(networkGroups).orderBy(desc(networkGroups.createdAt));
  }

  async createNetworkGroup(groupData: InsertNetworkGroup): Promise<NetworkGroup> {
    const [group] = await db
      .insert(networkGroups)
      .values(groupData)
      .returning();
    return group;
  }

  // Network connection operations
  async getNetworkConnections(): Promise<NetworkConnection[]> {
    return await db.select().from(networkConnections).orderBy(desc(networkConnections.createdAt));
  }

  async createNetworkConnection(connectionData: InsertNetworkConnection): Promise<NetworkConnection> {
    const [connection] = await db
      .insert(networkConnections)
      .values({
        ...connectionData,
        status: connectionData.status || 'active',
      })
      .returning();
    return connection;
  }

  // Performance metrics operations
  async getPerformanceMetrics(nodeId?: string, timeRange?: string): Promise<PerformanceMetric[]> {
    let query = db.select().from(performanceMetrics);
    
    if (nodeId) {
      query = query.where(eq(performanceMetrics.nodeId, nodeId));
    }
    
    if (timeRange) {
      const now = new Date();
      let timeAgo: Date;
      
      switch (timeRange) {
        case '1h':
          timeAgo = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case '24h':
          timeAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          timeAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        default:
          timeAgo = new Date(now.getTime() - 60 * 60 * 1000); // Default to 1 hour
      }
      
      query = query.where(gte(performanceMetrics.timestamp, timeAgo));
    }
    
    return await query.orderBy(desc(performanceMetrics.timestamp));
  }

  async recordPerformanceMetric(metricData: InsertPerformanceMetric): Promise<PerformanceMetric> {
    const [metric] = await db
      .insert(performanceMetrics)
      .values(metricData)
      .returning();
    return metric;
  }

  // Alert operations
  async getAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).orderBy(desc(alerts.createdAt));
  }

  async createAlert(alertData: InsertAlert): Promise<Alert> {
    const [alert] = await db
      .insert(alerts)
      .values({
        ...alertData,
        status: alertData.status || 'active',
      })
      .returning();
    return alert;
  }

  async acknowledgeAlert(id: string, acknowledgedBy: string): Promise<Alert | undefined> {
    const [alert] = await db
      .update(alerts)
      .set({
        status: 'acknowledged',
        acknowledgedBy,
        acknowledgedAt: new Date(),
      })
      .where(eq(alerts.id, id))
      .returning();
    return alert;
  }

  // AI diagnostic operations
  async createAiDiagnosticSession(sessionData: InsertAiDiagnosticSession): Promise<AiDiagnosticSession> {
    const [session] = await db
      .insert(aiDiagnosticSessions)
      .values(sessionData)
      .returning();
    return session;
  }

  async getAiDiagnosticSessions(userId: string): Promise<AiDiagnosticSession[]> {
    return await db
      .select()
      .from(aiDiagnosticSessions)
      .where(eq(aiDiagnosticSessions.userId, userId))
      .orderBy(desc(aiDiagnosticSessions.createdAt));
  }

  // Topology operations
  async createTopologySnapshot(snapshotData: InsertTopologySnapshot): Promise<TopologySnapshot> {
    const [snapshot] = await db
      .insert(topologySnapshots)
      .values(snapshotData)
      .returning();
    return snapshot;
  }
}

export const storage = new DatabaseStorage();

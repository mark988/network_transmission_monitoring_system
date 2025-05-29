import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { analyzeProblem, chatWithAI, generateNetworkInsights } from "./openai";
import { z } from "zod";

const createNodeSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["router", "switch", "server", "endpoint"]),
  ipAddress: z.string().min(1),
  macAddress: z.string().optional(),
  location: z.string().optional(),
  groupId: z.string().optional(),
});

const createAlertSchema = z.object({
  nodeId: z.string().optional(),
  alertType: z.enum(["performance", "connectivity", "security"]),
  severity: z.enum(["info", "warning", "critical"]),
  title: z.string().min(1),
  description: z.string().optional(),
});

const aiQuerySchema = z.object({
  query: z.string().min(1),
  nodeId: z.string().optional(),
  context: z.any().optional(),
});

const chatMessageSchema = z.object({
  message: z.string().min(1),
  context: z.any().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats endpoint
  app.get('/api/dashboard/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Network nodes endpoints
  app.get('/api/nodes', isAuthenticated, async (req, res) => {
    try {
      const nodes = await storage.getNetworkNodes();
      res.json(nodes);
    } catch (error) {
      console.error("Error fetching nodes:", error);
      res.status(500).json({ message: "Failed to fetch nodes" });
    }
  });

  app.post('/api/nodes', isAuthenticated, async (req, res) => {
    try {
      const nodeData = createNodeSchema.parse(req.body);
      const node = await storage.createNetworkNode(nodeData);
      res.status(201).json(node);
    } catch (error) {
      console.error("Error creating node:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid node data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create node" });
      }
    }
  });

  app.put('/api/nodes/:id', isAuthenticated, async (req, res) => {
    try {
      const nodeData = createNodeSchema.parse(req.body);
      const node = await storage.updateNetworkNode(req.params.id, nodeData);
      if (!node) {
        return res.status(404).json({ message: "Node not found" });
      }
      res.json(node);
    } catch (error) {
      console.error("Error updating node:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid node data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update node" });
      }
    }
  });

  app.delete('/api/nodes/:id', isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteNetworkNode(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Node not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting node:", error);
      res.status(500).json({ message: "Failed to delete node" });
    }
  });

  // Network groups endpoints
  app.get('/api/groups', isAuthenticated, async (req, res) => {
    try {
      const groups = await storage.getNetworkGroups();
      res.json(groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      res.status(500).json({ message: "Failed to fetch groups" });
    }
  });

  // Alerts endpoints
  app.get('/api/alerts', isAuthenticated, async (req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.post('/api/alerts', isAuthenticated, async (req, res) => {
    try {
      const alertData = createAlertSchema.parse(req.body);
      const alert = await storage.createAlert(alertData);
      res.status(201).json(alert);
    } catch (error) {
      console.error("Error creating alert:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid alert data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create alert" });
      }
    }
  });

  app.patch('/api/alerts/:id/acknowledge', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const userName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || "Unknown User";
      
      const alert = await storage.acknowledgeAlert(req.params.id, userName);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      console.error("Error acknowledging alert:", error);
      res.status(500).json({ message: "Failed to acknowledge alert" });
    }
  });

  // Performance metrics endpoints
  app.get('/api/metrics/performance', isAuthenticated, async (req, res) => {
    try {
      const nodeId = req.query.nodeId as string;
      const timeRange = req.query.timeRange as string || '1h';
      const metrics = await storage.getPerformanceMetrics(nodeId, timeRange);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching performance metrics:", error);
      res.status(500).json({ message: "Failed to fetch performance metrics" });
    }
  });

  app.post('/api/metrics/performance', isAuthenticated, async (req, res) => {
    try {
      const metric = await storage.recordPerformanceMetric(req.body);
      res.status(201).json(metric);
    } catch (error) {
      console.error("Error recording performance metric:", error);
      res.status(500).json({ message: "Failed to record performance metric" });
    }
  });

  // AI Diagnosis endpoints
  app.post('/api/ai/diagnose', isAuthenticated, async (req, res) => {
    try {
      const queryData = aiQuerySchema.parse(req.body);
      const diagnosis = await analyzeProblem(queryData);
      
      // Record the diagnosis session
      const userId = (req as any).user.claims.sub;
      await storage.createAiDiagnosticSession({
        userId,
        nodeId: queryData.nodeId,
        query: queryData.query,
        response: JSON.stringify(diagnosis),
        context: queryData.context,
      });

      res.json(diagnosis);
    } catch (error) {
      console.error("Error in AI diagnosis:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid query data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to perform AI diagnosis" });
      }
    }
  });

  app.post('/api/ai/chat', isAuthenticated, async (req, res) => {
    try {
      const chatData = chatMessageSchema.parse(req.body);
      const response = await chatWithAI(chatData.message, chatData.context);
      
      // Record the chat session
      const userId = (req as any).user.claims.sub;
      await storage.createAiDiagnosticSession({
        userId,
        query: chatData.message,
        response: response,
        context: chatData.context,
      });

      res.json({ response });
    } catch (error) {
      console.error("Error in AI chat:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid chat data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to get AI response" });
      }
    }
  });

  app.get('/api/ai/sessions', isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const sessions = await storage.getAiDiagnosticSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching AI sessions:", error);
      res.status(500).json({ message: "Failed to fetch AI sessions" });
    }
  });

  // Topology endpoints
  app.get('/api/topology/snapshot', isAuthenticated, async (req, res) => {
    try {
      const nodes = await storage.getNetworkNodes();
      const connections = await storage.getNetworkConnections();
      res.json({ nodes, connections });
    } catch (error) {
      console.error("Error fetching topology:", error);
      res.status(500).json({ message: "Failed to fetch topology" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');

    // Send initial data
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to network monitoring system'
    }));

    // Send periodic updates
    const updateInterval = setInterval(async () => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          const stats = await storage.getDashboardStats();
          ws.send(JSON.stringify({
            type: 'stats_update',
            data: stats
          }));
        } catch (error) {
          console.error('Error sending WebSocket update:', error);
        }
      }
    }, 30000); // Update every 30 seconds

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      clearInterval(updateInterval);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clearInterval(updateInterval);
    });
  });

  return httpServer;
}

import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"), // admin, operator, viewer
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Network nodes table
export const networkNodes = pgTable("network_nodes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type").notNull(), // router, switch, server, endpoint
  ipAddress: varchar("ip_address").notNull().unique(),
  macAddress: varchar("mac_address"),
  location: varchar("location"),
  groupId: uuid("group_id"),
  status: varchar("status").default("unknown"), // online, offline, warning, error
  lastSeen: timestamp("last_seen"),
  metadata: jsonb("metadata"), // Additional device-specific data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Network groups for organizing nodes
export const networkGroups = pgTable("network_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  parentId: uuid("parent_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Network connections between nodes
export const networkConnections = pgTable("network_connections", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceNodeId: uuid("source_node_id").notNull(),
  targetNodeId: uuid("target_node_id").notNull(),
  connectionType: varchar("connection_type"), // ethernet, fiber, wireless
  bandwidth: integer("bandwidth"), // in Mbps
  status: varchar("status").default("active"), // active, inactive, degraded
  createdAt: timestamp("created_at").defaultNow(),
});

// Performance metrics table
export const performanceMetrics = pgTable("performance_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  nodeId: uuid("node_id").notNull(),
  metricType: varchar("metric_type").notNull(), // cpu, memory, disk, network_io, latency, packet_loss
  value: decimal("value", { precision: 10, scale: 4 }).notNull(),
  unit: varchar("unit").notNull(), // percent, ms, mbps, etc.
  timestamp: timestamp("timestamp").defaultNow(),
});

// Alerts table
export const alerts = pgTable("alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  nodeId: uuid("node_id"),
  alertType: varchar("alert_type").notNull(), // performance, connectivity, security
  severity: varchar("severity").notNull(), // info, warning, critical
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status").default("active"), // active, acknowledged, resolved
  acknowledgedBy: varchar("acknowledged_by"),
  acknowledgedAt: timestamp("acknowledged_at"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI diagnostic sessions
export const aiDiagnosticSessions = pgTable("ai_diagnostic_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull(),
  nodeId: uuid("node_id"),
  query: text("query").notNull(),
  response: text("response"),
  context: jsonb("context"), // Additional context data
  createdAt: timestamp("created_at").defaultNow(),
});

// Network topology snapshots
export const topologySnapshots = pgTable("topology_snapshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  snapshotData: jsonb("snapshot_data").notNull(), // Complete topology state
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relations
export const networkNodesRelations = relations(networkNodes, ({ one, many }) => ({
  group: one(networkGroups, {
    fields: [networkNodes.groupId],
    references: [networkGroups.id],
  }),
  sourceConnections: many(networkConnections, {
    relationName: "sourceNode",
  }),
  targetConnections: many(networkConnections, {
    relationName: "targetNode",
  }),
  metrics: many(performanceMetrics),
  alerts: many(alerts),
}));

export const networkGroupsRelations = relations(networkGroups, ({ one, many }) => ({
  parent: one(networkGroups, {
    fields: [networkGroups.parentId],
    references: [networkGroups.id],
  }),
  children: many(networkGroups),
  nodes: many(networkNodes),
}));

export const networkConnectionsRelations = relations(networkConnections, ({ one }) => ({
  sourceNode: one(networkNodes, {
    fields: [networkConnections.sourceNodeId],
    references: [networkNodes.id],
    relationName: "sourceNode",
  }),
  targetNode: one(networkNodes, {
    fields: [networkConnections.targetNodeId],
    references: [networkNodes.id],
    relationName: "targetNode",
  }),
}));

export const performanceMetricsRelations = relations(performanceMetrics, ({ one }) => ({
  node: one(networkNodes, {
    fields: [performanceMetrics.nodeId],
    references: [networkNodes.id],
  }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  node: one(networkNodes, {
    fields: [alerts.nodeId],
    references: [networkNodes.id],
  }),
}));

export const aiDiagnosticSessionsRelations = relations(aiDiagnosticSessions, ({ one }) => ({
  user: one(users, {
    fields: [aiDiagnosticSessions.userId],
    references: [users.id],
  }),
  node: one(networkNodes, {
    fields: [aiDiagnosticSessions.nodeId],
    references: [networkNodes.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNetworkNodeSchema = createInsertSchema(networkNodes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNetworkGroupSchema = createInsertSchema(networkGroups).omit({
  id: true,
  createdAt: true,
});

export const insertNetworkConnectionSchema = createInsertSchema(networkConnections).omit({
  id: true,
  createdAt: true,
});

export const insertPerformanceMetricSchema = createInsertSchema(performanceMetrics).omit({
  id: true,
  timestamp: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

export const insertAiDiagnosticSessionSchema = createInsertSchema(aiDiagnosticSessions).omit({
  id: true,
  createdAt: true,
});

export const insertTopologySnapshotSchema = createInsertSchema(topologySnapshots).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type NetworkNode = typeof networkNodes.$inferSelect;
export type InsertNetworkNode = z.infer<typeof insertNetworkNodeSchema>;
export type NetworkGroup = typeof networkGroups.$inferSelect;
export type InsertNetworkGroup = z.infer<typeof insertNetworkGroupSchema>;
export type NetworkConnection = typeof networkConnections.$inferSelect;
export type InsertNetworkConnection = z.infer<typeof insertNetworkConnectionSchema>;
export type PerformanceMetric = typeof performanceMetrics.$inferSelect;
export type InsertPerformanceMetric = z.infer<typeof insertPerformanceMetricSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type AiDiagnosticSession = typeof aiDiagnosticSessions.$inferSelect;
export type InsertAiDiagnosticSession = z.infer<typeof insertAiDiagnosticSessionSchema>;
export type TopologySnapshot = typeof topologySnapshots.$inferSelect;
export type InsertTopologySnapshot = z.infer<typeof insertTopologySnapshotSchema>;

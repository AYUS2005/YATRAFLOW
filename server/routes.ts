import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAlertSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all alerts
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAllAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  // Get alerts by type
  app.get("/api/alerts/type/:type", async (req, res) => {
    try {
      const { type } = req.params;
      if (!["accident", "traffic", "hazard"].includes(type)) {
        return res.status(400).json({ error: "Invalid alert type" });
      }
      const alerts = await storage.getAlertsByType(type);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts by type" });
    }
  });

  // Create new alert
  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      res.status(201).json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid alert data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create alert" });
    }
  });

  // Delete alert
  app.delete("/api/alerts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteAlert(id);
      if (!deleted) {
        return res.status(404).json({ error: "Alert not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete alert" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

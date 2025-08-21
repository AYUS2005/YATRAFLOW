import { type User, type InsertUser, type Alert, type InsertAlert } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllAlerts(): Promise<Alert[]>;
  getAlert(id: string): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  deleteAlert(id: string): Promise<boolean>;
  getAlertsByType(type: string): Promise<Alert[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private alerts: Map<string, Alert>;

  constructor() {
    this.users = new Map();
    this.alerts = new Map();
    
    // Add some sample alerts for demonstration
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleAlerts: Alert[] = [
      {
        id: "1",
        type: "accident",
        description: "Multi-car collision on Highway 101 near Exit 15. Traffic backed up 2 miles.",
        location: "Highway 101, Mile 15",
        latitude: 37.7749,
        longitude: -122.4194,
        reportedBy: null,
        createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      },
      {
        id: "2",
        type: "traffic",
        description: "Slow moving traffic on Main Street due to construction work. Expect 15-20 min delays.",
        location: "Main Street & 5th Ave",
        latitude: 37.7849,
        longitude: -122.4094,
        reportedBy: null,
        createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      },
      {
        id: "3",
        type: "hazard",
        description: "Large pothole reported in right lane. Drive with caution.",
        location: "Oak Street Bridge",
        latitude: 37.7649,
        longitude: -122.4294,
        reportedBy: null,
        createdAt: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
      },
      {
        id: "4",
        type: "accident",
        description: "Fender bender blocking left turn lane. Emergency services on scene.",
        location: "Pine & Elm Intersection",
        latitude: 37.7549,
        longitude: -122.4394,
        reportedBy: null,
        createdAt: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
      },
    ];

    sampleAlerts.forEach(alert => {
      this.alerts.set(alert.id, alert);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getAlert(id: string): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const alert: Alert = {
      ...insertAlert,
      id,
      reportedBy: null,
      createdAt: new Date(),
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async deleteAlert(id: string): Promise<boolean> {
    return this.alerts.delete(id);
  }

  async getAlertsByType(type: string): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.type === type)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new MemStorage();

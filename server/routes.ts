import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.questions.list.path, async (req, res) => {
    try {
      const questions = await storage.getQuestions();
      res.json(questions);
    } catch (err) {
      console.error("Error reading questions:", err);
      res.status(500).json({ message: "Failed to load questions" });
    }
  });

  return httpServer;
}
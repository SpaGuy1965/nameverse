import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Seed data on startup
  storage.seedNamesIfEmpty();

  // GET /api/names/random?pack=all|heroes|women|kings|prophets|new_testament
  app.get("/api/names/random", (req, res) => {
    const pack = (req.query.pack as string) || "all";
    const name = storage.getRandomName(pack);
    if (!name) return res.status(404).json({ error: "No names found" });
    res.json(name);
  });

  // GET /api/names — all names
  app.get("/api/names", (_req, res) => {
    res.json(storage.getAllNames());
  });

  // GET /api/names/:id
  app.get("/api/names/:id", (req, res) => {
    const name = storage.getNameById(Number(req.params.id));
    if (!name) return res.status(404).json({ error: "Name not found" });
    res.json(name);
  });

  // GET /api/favorites?sessionId=xxx
  app.get("/api/favorites", (req, res) => {
    const sessionId = req.query.sessionId as string;
    if (!sessionId) return res.status(400).json({ error: "sessionId required" });
    res.json(storage.getFavorites(sessionId));
  });

  // POST /api/favorites
  app.post("/api/favorites", (req, res) => {
    const { sessionId, nameId } = req.body;
    if (!sessionId || !nameId) return res.status(400).json({ error: "sessionId and nameId required" });
    if (storage.isFavorite(sessionId, nameId)) {
      return res.status(409).json({ error: "Already favorited" });
    }
    const fav = storage.addFavorite({ sessionId, nameId, savedAt: Date.now() });
    res.json(fav);
  });

  // DELETE /api/favorites
  app.delete("/api/favorites", (req, res) => {
    const { sessionId, nameId } = req.body;
    if (!sessionId || !nameId) return res.status(400).json({ error: "sessionId and nameId required" });
    storage.removeFavorite(sessionId, Number(nameId));
    res.json({ success: true });
  });

  // GET /api/history?sessionId=xxx
  app.get("/api/history", (req, res) => {
    const sessionId = req.query.sessionId as string;
    if (!sessionId) return res.status(400).json({ error: "sessionId required" });
    res.json(storage.getHistory(sessionId));
  });

  // POST /api/history
  app.post("/api/history", (req, res) => {
    const { sessionId, nameId } = req.body;
    if (!sessionId || !nameId) return res.status(400).json({ error: "sessionId and nameId required" });
    const entry = storage.addHistory({ sessionId, nameId, generatedAt: Date.now() });
    res.json(entry);
  });

  return httpServer;
}

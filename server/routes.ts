import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import { credentials, insertVideoSchema } from "@shared/schema";
import fs from "fs/promises";

const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (_req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  }),
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [".mp4", ".webm", ".mov"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  }
});

export function registerRoutes(app: Express): Server {
  // Ensure uploads directory exists
  fs.mkdir("uploads", { recursive: true }).catch(console.error);

  app.post("/api/auth", (req, res) => {
    const { username, password } = req.body;
    
    if (username === credentials.admin.username && password === credentials.admin.password) {
      res.json({ role: "admin" });
    } else if (username === credentials.editor.username && password === credentials.editor.password) {
      res.json({ role: "editor" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  app.get("/api/videos", async (_req, res) => {
    const videos = await storage.getVideos();
    res.json(videos);
  });

  app.post("/api/videos", upload.single("video"), async (req: Request & { file?: Express.Multer.File }, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    const parseResult = insertVideoSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid video data" });
    }

    const video = await storage.addVideo({
      title: req.body.title,
      filename: req.file.filename,
      uploadedBy: req.body.username || "unknown",
      uploadedAt: new Date().toISOString()
    });

    res.json(video);
  });

  app.get("/api/videos/:filename", async (req, res) => {
    const filePath = path.join("uploads", req.params.filename);
    res.sendFile(filePath, { root: process.cwd() });
  });

  const httpServer = createServer(app);
  return httpServer;
}

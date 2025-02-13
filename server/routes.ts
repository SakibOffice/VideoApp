import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import { credentials, insertVideoSchema } from "@shared/schema";
import fs from "fs/promises";

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      fs.mkdir("uploads", { recursive: true })
        .then(() => cb(null, "uploads/"))
        .catch(err => cb(err, "uploads/"));
    },
    filename: (_req, file, cb) => {
      // Ensure unique filenames with timestamps
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
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
  // Ensure uploads directory exists on startup
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
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No video file uploaded" });
      }

      const parseResult = insertVideoSchema.safeParse({
        title: req.body.title,
        filename: req.file.filename
      });

      if (!parseResult.success) {
        // Delete the uploaded file if validation fails
        await fs.unlink(path.join("uploads", req.file.filename)).catch(console.error);
        return res.status(400).json({ message: parseResult.error.message });
      }

      const video = await storage.addVideo({
        title: req.body.title,
        filename: req.file.filename,
        uploadedBy: "editor", // Since we know it's the editor uploading
        uploadedAt: new Date().toISOString()
      });

      res.json(video);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: "Failed to process video upload" });
    }
  });

  app.get("/api/videos/:filename", async (req, res) => {
    const filePath = path.join("uploads", req.params.filename);
    res.sendFile(filePath, { root: process.cwd() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
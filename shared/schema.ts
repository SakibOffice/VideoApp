import { z } from "zod";

export interface Video {
  id: string;
  title: string;
  filename: string;
  uploadedBy: string;
  uploadedAt: string;
}

export const videoSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  filename: z.string(),
  uploadedBy: z.string(),
  uploadedAt: z.string()
});

export const insertVideoSchema = videoSchema.omit({ 
  id: true,
  uploadedBy: true,
  uploadedAt: true 
});

export type InsertVideo = z.infer<typeof insertVideoSchema>;

export const credentials = {
  admin: { username: "admin", password: "admin123" },
  editor: { username: "editor", password: "editor123" }
};

import { type Video } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getVideos(): Promise<Video[]>;
  addVideo(video: Omit<Video, "id">): Promise<Video>;
  getVideo(id: string): Promise<Video | undefined>;
}

export class MemStorage implements IStorage {
  private videos: Map<string, Video>;

  constructor() {
    this.videos = new Map();
  }

  async getVideos(): Promise<Video[]> {
    return Array.from(this.videos.values());
  }

  async addVideo(video: Omit<Video, "id">): Promise<Video> {
    const id = randomUUID();
    const newVideo: Video = { ...video, id };
    this.videos.set(id, newVideo);
    return newVideo;
  }

  async getVideo(id: string): Promise<Video | undefined> {
    return this.videos.get(id);
  }
}

export const storage = new MemStorage();

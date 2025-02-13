import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { insertVideoSchema } from "@shared/schema";

export function UploadForm() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const parseResult = insertVideoSchema.safeParse({ title });
    if (!parseResult.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: parseResult.error.errors[0].message
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", file);

    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error("Upload failed");

      toast({
        title: "Success",
        description: "Video uploaded successfully"
      });

      setTitle("");
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload video"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            type="file"
            accept=".mp4,.webm,.mov"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Button type="submit" disabled={!file || uploading} className="w-full">
            {uploading ? "Uploading..." : "Upload Video"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

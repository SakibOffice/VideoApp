import { useQuery } from "@tanstack/react-query";
import { VideoPlayer } from "./video-player";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Video } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";

export function VideoGrid() {
  const { data: videos, isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"]
  });

  if (isLoading) {
    return <div>Loading videos...</div>;
  }

  return (
    <ScrollArea className="h-[calc(100vh-2rem)]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {videos?.map((video) => (
          <Card key={video.id}>
            <CardHeader>
              <CardTitle>{video.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <VideoPlayer url={`/api/videos/${video.filename}`} />
              <div className="mt-2 text-sm text-muted-foreground">
                Uploaded by {video.uploadedBy} on{" "}
                {new Date(video.uploadedAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

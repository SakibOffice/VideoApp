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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {videos?.map((video) => (
          <Card key={video.id} className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">{video.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="mb-3">
                <VideoPlayer url={`/api/videos/${video.filename}`} />
              </div>
              <div className="text-sm text-muted-foreground">
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
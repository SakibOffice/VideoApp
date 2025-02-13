import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { VideoPlayer } from "@/components/video-player";
import { type Video } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function VideoTheater() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: videos } = useQuery<Video[]>({
    queryKey: ["/api/videos"]
  });

  const video = videos?.find(v => v.id === id);

  if (!video) {
    return <div>Video not found</div>;
  }

  const handleDownload = async () => {
    const response = await fetch(`/api/videos/${video.filename}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = video.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto py-4">
        <Button 
          variant="ghost" 
          className="text-white mb-4"
          onClick={() => setLocation("/admin")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="w-full aspect-video mb-4">
          <VideoPlayer url={`/api/videos/${video.filename}`} />
        </div>
        
        <div className="bg-background rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
              <p className="text-sm text-muted-foreground">
                Uploaded by {video.uploadedBy} on{" "}
                {new Date(video.uploadedAt).toLocaleDateString()}
              </p>
            </div>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

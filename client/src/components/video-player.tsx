import ReactPlayer from "react-player";
import { Card } from "@/components/ui/card";

interface VideoPlayerProps {
  url: string;
}

export function VideoPlayer({ url }: VideoPlayerProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video">
        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          controls
          config={{
            file: {
              attributes: {
                controlsList: "nodownload"
              }
            }
          }}
        />
      </div>
    </Card>
  );
}

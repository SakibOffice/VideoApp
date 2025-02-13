import ReactPlayer from "react-player";
import { Card } from "@/components/ui/card";

interface VideoPlayerProps {
  url: string;
}

export function VideoPlayer({ url }: VideoPlayerProps) {
  return (
    <Card className="overflow-hidden w-full">
      <div 
        className="relative aspect-video bg-black"
        style={{ minHeight: '240px' }}
      >
        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          controls={true}
          playing={false}
          playsinline={true}
          pip={false}
          config={{
            file: {
              attributes: {
                style: {
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                },
                controlsList: 'nodownload',
              },
              forceVideo: true,
              forceHLS: false,
              forceDASH: false
            }
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
      </div>
    </Card>
  );
}
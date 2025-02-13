import ReactPlayer from "react-player";
import { Card } from "@/components/ui/card";

interface VideoPlayerProps {
  url: string;
}

export function VideoPlayer({ url }: VideoPlayerProps) {
  return (
    <Card className="overflow-hidden w-full bg-black rounded-lg">
      <div 
        className="relative w-full"
        style={{ 
          paddingTop: '56.25%', // 16:9 Aspect Ratio
        }}
      >
        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          controls={true}
          playing={false}
          playsinline={true}
          config={{
            file: {
              attributes: {
                style: {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                },
                controlsList: 'nodownload',
              },
              forceVideo: true,
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
"use client";

import { VideoPlayer } from "@/src/components/video-player";

type VideoLessonContentProps = {
  videoUrl: string;
  onEnded?: () => void;
};

export function VideoLessonContent({
  videoUrl,
  onEnded,
}: VideoLessonContentProps) {
  return (
    <div className="h-64 w-full overflow-hidden rounded-t-lg bg-black sm:h-80 md:h-96 lg:h-full">
      <VideoPlayer
        className="h-full w-full"
        url={videoUrl}
        style={{
          width: "100%",
          height: "100%",
        }}
        onEnded={onEnded}
      />
    </div>
  );
}

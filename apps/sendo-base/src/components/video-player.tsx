import { CSSProperties } from "react";
import ReactPlayer from "react-player";

export const VideoPlayer = ({
  url,
  className,
  style,
  onEnded,
}: {
  url: string;
  className?: string;
  style?: CSSProperties;
  onEnded?: () => void;
}) => {
  return (
    <ReactPlayer
      style={{ aspectRatio: "16/9", ...style }}
      className={className}
      src={url}
      controls
      onEnded={onEnded}
    />
  );
};

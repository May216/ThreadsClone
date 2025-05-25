import { View } from "react-native";
import { useVideoPlayer, VideoView, VideoViewProps } from "expo-video";

interface VideoProps extends Omit<VideoViewProps, 'player'> {
  uri: string;
}

export const Video = ({ className = 'w-32 h-40', uri, ...props }: VideoProps) => {
  const player = useVideoPlayer(uri, player => {
    player.loop = true;
    player.play();
  });

  return (
    <View className={`rounded-lg overflow-hidden ${className}`}>
      <VideoView
        player={player}
        style={{ width: '100%', height: '100%' }}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        {...props}
      />
    </View>
  );
};
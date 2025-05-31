import { View, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Video } from "./Video";

interface VideoPreviewProps {
  className?: string;
  uri: string;
  displayRemoveButton?: boolean;
  onPress?: () => void;
}

export const VideoPreview = ({ className = 'w-32 h-40', uri, displayRemoveButton = true, onPress }: VideoPreviewProps) => {
  return (
    <View className={`relative rounded-lg overflow-hidden ${className}`}>
      <Video uri={uri} className="w-full h-full" />
      {displayRemoveButton && (
        <Pressable
          className="bg-gray-500/30 rounded-full w-8 h-8 items-center justify-center absolute top-1 right-1 z-10"
          onPress={onPress}
        >
          <AntDesign name="close" size={16} color="white" />
        </Pressable>
      )}
    </View>
  );
};
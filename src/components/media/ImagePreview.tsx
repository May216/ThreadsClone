import { View, Pressable, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface ImagePreviewProps {
  className?: string;
  uri: string;
  displayRemoveButton?: boolean;
  onPress?: () => void;
}

export const ImagePreview = ({ className = 'w-32 h-40', uri, displayRemoveButton = true, onPress }: ImagePreviewProps) => {
  return (
    <View className="relative">
      <Image source={{ uri }} className={`rounded-lg ${className}`} />
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
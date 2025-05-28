import { View, Pressable, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export const ImagePreview = ({ uri, onPress }: { uri: string, onPress: () => void }) => {
  return (
    <View className="relative">
      <Image source={{ uri }} className="w-32 h-40 rounded-lg" />
      <Pressable
        className="bg-gray-500/30 rounded-full w-8 h-8 items-center justify-center absolute top-1 right-1 z-10"
        onPress={onPress}
      >
        <AntDesign name="close" size={16} color="white" />
      </Pressable>
    </View>
  );
};
import { ScrollView, View } from "react-native"
import { ImagePickerAsset } from "expo-image-picker"
import { ImagePreview, VideoPreview } from "../media"

interface PostMediaWithLocalProps {
  medias: ImagePickerAsset[]
}

export const PostMediaWithLocal = ({ medias }: PostMediaWithLocalProps) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
      <View className="flex-row items-center gap-2">
        {medias.map((media, index) => media.type === 'image' ? (
          <ImagePreview
            key={index}
            uri={media.uri}
            displayRemoveButton={false}
            className="w-48 h-72"
          />
        ) : (
          <VideoPreview
            key={index}
            uri={media.uri}
            displayRemoveButton={false}
            className="w-48 h-72"
          />
        ))}
      </View>
    </ScrollView>
  )
}
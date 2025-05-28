import { ScrollView, View } from "react-native"
import { Video, SupabaseImage } from "../media"
import { supabase } from "@/lib/supabase"

type PostMediaProps = {
  medias?: string[] | null
}

export const PostMedia = ({ medias }: PostMediaProps) => {
  if (!medias?.length) return null

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    >
      <View className="flex-row gap-4" onStartShouldSetResponder={() => true}>
        {medias?.map((media) => {
          const uri = supabase.storage.from('media').getPublicUrl(media).data.publicUrl
          return media.includes('.mp4') ? (
            <Video
              key={media}
              uri={uri}
              className="w-64 h-80 rounded-lg"
            />
          ) : (
            <SupabaseImage
              key={media}
              bucket="media"
              path={media}
              className="w-64 h-80 rounded-lg"
              transform={{ width: 300, height: 300 }}
            />
          )
        })}
      </View>
    </ScrollView>
  )
} 
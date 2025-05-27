import { memo } from "react"
import { View, Text, ScrollView, ActivityIndicator } from "react-native"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import { Video } from "./Video"
import { SupabaseImage } from "./SupabaseImage"
import { supabase } from "@/lib/supabase"
import { Tables } from "@/types/database.types"

dayjs.extend(relativeTime)

type PostWithUser = Tables<'posts'> & {
  user: Tables<'profiles'>
}

export const QuotePost = memo(({ post }: { post: PostWithUser }) => {
  if (!post) return <ActivityIndicator />
  return (
    <View
      className="flex-row border border-gray-600 rounded-lg p-3 mt-4"
      accessibilityRole="none"
      accessibilityLabel={`Post by ${post?.user?.username}`}
    >
      <View className='mr-3 items-center'>
        <SupabaseImage
          bucket="avatars"
          path={post?.user?.avatar_url!}
          className='w-12 h-12 rounded-full'
          transform={{ width: 48, height: 48 }}
        />
      </View>

      <View className="flex-1">
        <View className="flex-row items-center">
          <Text className="text-white font-bold mr-2">{post?.user?.username}</Text>
          <Text className="text-gray-500">
            {dayjs(post?.created_at).fromNow()}
          </Text>
        </View>

        <Text className="text-white mt-2 mb-3">{post?.content}</Text>

        {post?.medias?.length && (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            <View className="flex-row gap-4" onStartShouldSetResponder={() => true}>
              {post?.medias?.map((media) => {
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
        )}
      </View>
    </View>
  )
})
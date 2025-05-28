import { memo } from "react"
import { View, Text, Pressable } from "react-native"
import { Link } from "expo-router"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import { InteractionButton } from "../common"
import { SupabaseImage } from "../media"
import { PostMedia } from "./PostMedia"
import { usePostInteractions } from "@/hooks/usePostInteractions"
import { Tables } from "@/types/database.types"

dayjs.extend(relativeTime)

type PostWithUser = Tables<'posts'> & {
  user: Tables<'profiles'>
  replies: {
    count: number
  }[]
}

export const PostDetails = memo(({ post }: { post: PostWithUser }) => {
  const {
    likes,
    hasLiked,
    likeMutation,
    repostsCount,
    hasReposted,
    handleRepost,
    handleReply,
    handleShare
  } = usePostInteractions(post)

  return (
    <Link href={`posts/${post.id}`} asChild>
      <Pressable
        className="p-4 border-b border-gray-800/70 gap-4"
        accessibilityRole="none"
        accessibilityLabel={`Post by ${post.user.username}`}
      >
        {/* user info */}
        <View className="flex-1 flex-row items-center gap-3">
          {/* avatar */}
          <SupabaseImage
            bucket="avatars"
            path={post.user.avatar_url!}
            className='w-12 h-12 rounded-full'
            transform={{ width: 48, height: 48 }}
          />
          <Text className="text-white font-bold">
            {post.user.username}
          </Text>
          <Text className="text-gray-500">
            {dayjs(post.created_at).fromNow()}
          </Text>
        </View>
        {/* post content */}
        <View className="flex-1">
          <Text className="text-white">
            {post.content}
          </Text>
        </View>
        {/* medias */}
        <PostMedia medias={post.medias} />
        {/* interaction buttons */}
        <View className="flex-row gap-6">
          <InteractionButton
            icon={hasLiked ? "heart" : "heart-outline"}
            count={likes?.length}
            accessibilityLabel={hasLiked ? "取消點讚" : "點讚"}
            color={hasLiked ? "#E5397F" : undefined}
            onPress={() => likeMutation.mutate()}
          />
          <InteractionButton
            icon="chatbubble-outline"
            count={post.replies?.[0]?.count}
            accessibilityLabel={`回覆 ${post.user.username} 的貼文`}
            onPress={handleReply}
          />
          <InteractionButton
            icon="repeat"
            count={repostsCount}
            accessibilityLabel={hasReposted ? "取消轉發" : "轉發"}
            color={hasReposted ? "#53B780" : undefined}
            onPress={handleRepost}
          />
          <InteractionButton
            icon="paper-plane-outline"
            onPress={handleShare}
            accessibilityLabel="分享"
          />
        </View>
      </Pressable>
    </Link>
  )
})
import { memo } from "react"
import { View, Text, Pressable } from "react-native"
import { Link } from "expo-router"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import { InteractionButton } from "../common"
import { SupabaseImage } from "../media"
import { PostMedia } from "./PostMedia"
import { usePostInteractions } from "@/hooks"
import { Tables } from "@/types/database.types"

dayjs.extend(relativeTime)

type PostWithUser = Tables<'posts'> & {
  user: Tables<'profiles'>
  replies: {
    count: number
  }[]
}

export const PostListItem = memo(({ post, isLastInGroup = true }: { post: PostWithUser, isLastInGroup?: boolean }) => {
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
        className={`flex-row p-4 ${isLastInGroup ? 'border-b border-gray-800/70' : ''}`}
        accessibilityRole="none"
        accessibilityLabel={`Post by ${post.user.username}`}
      >
        {/* avatar */}
        <View className='mr-3 items-center gap-2'>
          <SupabaseImage
            bucket="avatars"
            path={post.user.avatar_url!}
            className='w-12 h-12 rounded-full'
            transform={{ width: 48, height: 48 }}
          />
          {!isLastInGroup && (
            <View className="w-[3px] flex-1 rounded-full bg-neutral-700 translate-y-2" />
          )}
        </View>

        {/* content area */}
        <View className="flex-1">
          {/* user info */}
          <View className="flex-row items-center">
            <Text className="text-white font-bold mr-2">{post.user.username}</Text>
            <Text className="text-gray-500">
              {dayjs(post.created_at).fromNow()}
            </Text>
          </View>

          {/* post content */}
          <Text className="text-white mt-2 mb-3">{post.content}</Text>

          {/* medias */}
          <PostMedia medias={post.medias} />

          {/* interaction buttons */}
          <View className="flex-row gap-6 mt-2">
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
        </View>
      </Pressable>
    </Link>
  )
})
import { View, Text, Pressable } from "react-native"
import { Link } from "expo-router"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import FeatherIcon from "@expo/vector-icons/Feather"

import { ConfirmModal, InteractionButton } from "../common"
import { SupabaseImage } from "../media"
import { PostMedia } from "./PostMedia"
import { usePostActions, usePostInteractions } from "@/hooks"
import { Tables } from "@/types/database.types"

dayjs.extend(relativeTime)

type PostWithUser = Tables<'posts'> & {
  user: Tables<'profiles'>
  replies: {
    count: number
  }[]
}

export const PostListItem = ({ post, isLastInGroup = true }: { post: PostWithUser, isLastInGroup?: boolean }) => {
  const {
    isModalVisible,
    setIsModalVisible,
    hasLiked,
    likeMutation,
    hasReposted,
    handleRepost,
    handleReply,
    handleShare,
    handleMore,
    handleUserPress
  } = usePostInteractions(post)
  const { deletePost } = usePostActions(post)

  const deleteOptions = [
    {
      text: '刪除',
      textClassName: 'text-red-500',
      onPress: () => {
        deletePost()
        setIsModalVisible(false)
      }
    },
    {
      text: '取消',
      onPress: () => {
        setIsModalVisible(false)
      }
    }
  ]

  return (
    <Link href={`posts/${post.id}`} asChild>
      <Pressable
        className={`flex-row p-4 ${isLastInGroup ? 'border-b border-gray-800/70' : ''}`}
        accessibilityRole="none"
        accessibilityLabel={`Post by ${post.user.username}`}
      >
        {/* avatar */}
        <View className='mr-3 items-center gap-2'>
          <Pressable onPress={handleUserPress}>
            <SupabaseImage
              bucket="avatars"
              path={post.user.avatar_url!}
              className='w-12 h-12 rounded-full'
              transform={{ width: 48, height: 48 }}
            />
          </Pressable>
          {!isLastInGroup && (
            <View className="w-[3px] flex-1 rounded-full bg-neutral-700 translate-y-2" />
          )}
        </View>

        {/* content area */}
        <View className="flex-1 gap-2">
          {/* user info */}
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <Pressable onPress={handleUserPress}>
                <Text className="text-white font-bold mr-2">{post.user.username}</Text>
              </Pressable>
              <Text className="text-gray-500">
                {dayjs(post.created_at).fromNow()}
              </Text>
            </View>
            <FeatherIcon name="more-vertical" size={16} color="gray" onPress={handleMore} />
          </View>

          {/* post content */}
          {post.content && <Text className="text-white">{post.content}</Text>}

          {/* medias */}
          {post.medias && <PostMedia medias={post.medias} />}

          {/* interaction buttons */}
          <View className="flex-row gap-6">
            <InteractionButton
              icon={hasLiked ? "heart" : "heart-outline"}
              count={post.likes_count}
              accessibilityLabel={hasLiked ? "取消點讚" : "點讚"}
              color={hasLiked ? "#E5397F" : undefined}
              onPress={() => likeMutation.mutate()}
            />
            <InteractionButton
              icon="chatbubble-outline"
              count={post.replies_count}
              size={18}
              accessibilityLabel={`回覆 ${post.user.username} 的貼文`}
              onPress={handleReply}
            />
            <InteractionButton
              icon="repeat"
              count={post.reposts_count}
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
        <ConfirmModal
          isVisible={isModalVisible}
          title="刪除貼文？"
          message="如果刪除這則貼文，即無法復原。"
          options={deleteOptions}
          onBackdropPress={() => setIsModalVisible(false)}
        />
      </Pressable>
    </Link>
  )
}
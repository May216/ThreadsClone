import { memo, useCallback } from "react"
import { View, Text, ScrollView, Pressable } from "react-native"
import { Link, router } from "expo-router"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useActionSheet } from '@expo/react-native-action-sheet'

import { InteractionButton } from "./InteractionButton"
import { Video } from "./Video"
import { SupabaseImage } from "./SupabaseImage"
import { supabase } from "@/lib/supabase"
import { toggleLike, getPostLikes, getUserLikeStatus, getPostRepostsCount, getUserRepostsStatus, toggleRepost } from "@/services/interactions"
import { useAuth } from "@/providers/AuthProvider"
import { Tables } from "@/types/database.types"

dayjs.extend(relativeTime)

type PostWithUser = Tables<'posts'> & {
  user: Tables<'profiles'>
  replies: {
    count: number
  }[]
}

export const PostListItem = memo(({ post, isLastInGroup = true }: { post: PostWithUser, isLastInGroup?: boolean }) => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { showActionSheetWithOptions } = useActionSheet()

  const { data: likes } = useQuery({
    queryKey: ['likes', post.id],
    queryFn: () => getPostLikes(post.id)
  })

  const { data: hasLiked } = useQuery({
    queryKey: ['userLike', post.id, user?.id],
    queryFn: () => getUserLikeStatus(post.id, user!.id),
    enabled: !!user
  })

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(post.id, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes', post.id] })
      queryClient.invalidateQueries({ queryKey: ['userLike', post.id, user?.id] })
    }
  })

  const { data: repostsCount } = useQuery({
    queryKey: ['reposts', post.id],
    queryFn: () => getPostRepostsCount(post.id)
  })

  const { data: hasReposted } = useQuery({
    queryKey: ['userRepost', post.id, user?.id],
    queryFn: () => getUserRepostsStatus(post.id, user!.id),
    enabled: !!user
  })

  const repostMutation = useMutation({
    mutationFn: () => toggleRepost(post.id, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reposts', post.id] })
      queryClient.invalidateQueries({ queryKey: ['userRepost', post.id, user?.id] })
    }
  })

  const handleRepost = () => {
    const options = hasReposted
      ? ['移除', '引用', '取消']
      : ['轉發', '引用', '取消']
    const destructiveButtonIndex = hasReposted ? 0 : undefined
    const cancelButtonIndex = 3

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          repostMutation.mutate()
        } else if (buttonIndex === 1) {
          router.push({
            pathname: '/(protected)/new',
            params: { parent_id: post.id, post_type: 'quote' }
          })
        }
      }
    )
  }

  const handleReply = useCallback(() => {
    console.log('Reply to post:', post.id)
  }, [post.id])

  const handleShare = useCallback(() => {
    console.log('Share post:', post.id)
  }, [post.id])

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
          {post.medias?.length && (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <View className="flex-row gap-4" onStartShouldSetResponder={() => true}>
                {post.medias?.map((media) => {
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

          {/* interaction buttons */}
          <View className="flex-row gap-6 mt-2">
            <InteractionButton
              icon={hasLiked ? "heart" : "heart-outline"}
              count={likes?.length || 0}
              accessibilityLabel={hasLiked ? "取消點讚" : "點讚"}
              color={hasLiked ? "#ff3b30" : undefined}
              onPress={() => likeMutation.mutate()}
            />
            <InteractionButton
              icon="chatbubble-outline"
              count={post.replies?.[0].count || 0}
              accessibilityLabel={`回覆 ${post.user.username} 的貼文`}
              onPress={handleReply}
            />
            <InteractionButton
              icon="repeat"
              count={repostsCount || 0}
              accessibilityLabel={hasReposted ? "取消轉發" : "轉發"}
              color={hasReposted ? "#00A4E9" : undefined}
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
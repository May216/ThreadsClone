import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useActionSheet } from '@expo/react-native-action-sheet'
import { router } from "expo-router"
import { useAuth } from "@/providers/AuthProvider"
import { toggleLike, getPostLikes, getUserLikeStatus, getPostRepostsCount, getUserRepostsStatus, toggleRepost } from "@/services/interactions"
import { Tables } from "@/types/database.types"

type PostWithUser = Tables<'posts'> & {
  user: Tables<'profiles'>
  replies: {
    count: number
  }[]
}

export const usePostInteractions = (post: PostWithUser) => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { showActionSheetWithOptions } = useActionSheet()

  const postId = post.id
  const userId = user?.id

  const { data: likes } = useQuery({
    queryKey: ['likes', postId],
    queryFn: () => getPostLikes(postId)
  })

  const { data: hasLiked } = useQuery({
    queryKey: ['userLike', postId, userId],
    queryFn: () => getUserLikeStatus(postId, userId!),
    enabled: !!userId
  })

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(postId, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes', postId] })
      queryClient.invalidateQueries({ queryKey: ['userLike', postId, userId] })
    }
  })

  const { data: repostsCount } = useQuery({
    queryKey: ['reposts', postId],
    queryFn: () => getPostRepostsCount(postId)
  })

  const { data: hasReposted } = useQuery({
    queryKey: ['userRepost', postId, userId],
    queryFn: () => getUserRepostsStatus(postId, userId!),
    enabled: !!userId
  })

  const repostMutation = useMutation({
    mutationFn: () => toggleRepost(postId, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reposts', postId] })
      queryClient.invalidateQueries({ queryKey: ['userRepost', postId, userId] })
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
            params: { parent_id: postId, post_type: 'quote' }
          })
        }
      }
    )
  }

  const handleReply = () => {
    router.push({ pathname: `/posts/${postId}` })
  }

  const handleShare = () => {
    console.log('Share post:', postId)
  }

  return {
    likes,
    hasLiked,
    likeMutation,
    repostsCount,
    hasReposted,
    handleRepost,
    handleReply,
    handleShare
  }
} 
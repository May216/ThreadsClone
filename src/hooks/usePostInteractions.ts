import { Alert } from "react-native"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useActionSheet } from '@expo/react-native-action-sheet'
import { router } from "expo-router"

import { usePostActions } from "./usePostActions"
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
  const { deletePost } = usePostActions(post)

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
    const cancelButtonIndex = 2

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
            pathname: '/(protected)/newPost',
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

  const handleMore = () => {
    if (user?.id === post.user.id) {
      const options = ['編輯', '刪除', '取消']
      const destructiveButtonIndex = 1
      const cancelButtonIndex = 2

      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            router.push({
              pathname: '/(protected)/updatePost',
              params: { post_id: post.id }
            })
          } else if (buttonIndex === 1) {
            Alert.alert(
              '確認刪除',
              '確定要刪除這則貼文嗎？',
              [
                { text: '取消', style: 'cancel' },
                { text: '確定', style: 'destructive', onPress: () => deletePost() }
              ]
            )
          }
        }
      )
    } else {
      const options = ['檢舉', '取消']
      const cancelButtonIndex = 1

      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            // TODO: 實現檢舉功能
            console.log('Report post:', post.id)
          }
        }
      )
    }
  }

  return {
    likes,
    hasLiked,
    likeMutation,
    repostsCount,
    hasReposted,
    handleRepost,
    handleReply,
    handleShare,
    handleMore
  }
} 
import { Alert } from "react-native"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { router } from "expo-router"
import { Ionicons } from '@expo/vector-icons';

import { usePostActions } from "./usePostActions"
import { useAuth } from "@/providers/AuthProvider"
import { toggleLike, getPostLikes, getUserLikeStatus, getPostRepostsCount, getUserRepostsStatus, toggleRepost } from "@/services/interactions"
import { useBottomSheet } from "@/providers/BottomSheetProvider"
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
  const { open: openBottomSheet } = useBottomSheet()
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
    openBottomSheet('action', {
      options: [
        {
          key: 'repost',
          label: hasReposted ? '移除' : '轉發',
          danger: hasReposted,
          icon: <Ionicons name={hasReposted ? "close" : "repeat"} size={24} color={hasReposted ? "red" : "white"} />
        },
        {
          key: 'quote',
          label: '引用',
          icon: <Ionicons name="chatbubble-outline" size={24} color="white" />
        }
      ],
      onSelect: (key) => {        
        if (key === 'repost') {
          repostMutation.mutate()
        } else if (key === 'quote') {
          router.push({ pathname: '/(protected)/newPost', params: { parent_id: postId, post_type: 'quote' } })
        }
      }
    })
  }

  const handleReply = () => {
    router.push({ pathname: `/posts/${postId}` })
  }

  const handleShare = () => {
    console.log('Share post:', postId)
  }

  const handleMore = () => {
    if (user?.id === post.user.id) {
      openBottomSheet('action', {
        options: [
          {
            key: 'edit',
            label: '編輯',
            icon: <Ionicons name="create-outline" size={24} color="white" />
          },
          {
            key: 'delete',
            label: '刪除',
            danger: true,
            icon: <Ionicons name="trash-outline" size={24} color="red" />
          }
        ],
        onSelect: (key) => {        
          if (key === 'edit') {
            router.push({
              pathname: '/(protected)/updatePost',
              params: { post_id: post.id }
            })
          } else if (key === 'delete') {
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
      })
    } else {
      
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
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { router } from "expo-router"
import { Ionicons, Feather } from '@expo/vector-icons';

import { useAuth } from "@/providers/AuthProvider"
import { toggleLike, getUserLikeStatus, getUserRepostsStatus, toggleRepost } from "@/services/interactions"
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
  const [isModalVisible, setIsModalVisible] = useState(false)

  const postId = post.id
  const userId = user?.id

  const { data: hasLiked } = useQuery({
    queryKey: ['userLike', postId, userId],
    queryFn: () => getUserLikeStatus(postId, userId!),
    enabled: !!userId
  })

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(postId, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['userLike', postId, userId] })
    }
  })

  const { data: hasReposted } = useQuery({
    queryKey: ['userRepost', postId, userId],
    queryFn: () => getUserRepostsStatus(postId, userId!),
    enabled: !!userId
  })

  const repostMutation = useMutation({
    mutationFn: () => toggleRepost(postId, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
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
            icon: <Feather name="edit" size={20} color="white" />
          },
          {
            key: 'delete',
            label: '刪除',
            danger: true,
            icon: <Feather name="trash" size={20} color="red" />
          }
        ],
        onSelect: (key) => {
          if (key === 'edit') {
            router.push({
              pathname: '/(protected)/updatePost',
              params: { post_id: post.id }
            })
          } else if (key === 'delete') {
            setIsModalVisible(true)
          }
        }
      })
    } else {
      openBottomSheet('action', {
        options: [
          {
            key: 'report',
            label: '檢舉',
            danger: true,
            icon: <Ionicons name="alert-circle-outline" size={24} color="red" />
          }
        ],
        onSelect: (key) => {
          if (key === 'report') {
            console.log('Report post:', postId)
          }
        }
      })
    }
  }

  const handleUserPress = () => {
    if (post.user.id === user?.id) {
      router.push({ pathname: '/myProfile' })
    } else {
      router.push({
        pathname: '/profiles/[id]',
        params: {
          id: post.user.id,
          username: post.user.username
        }
      })
    }
  }

  return {
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
  }
} 
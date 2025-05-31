import { useState } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Link, router } from "expo-router";

import { ConfirmModal } from "../common"
import { SupabaseImage } from "../media"
import { getProfileById } from "@/services/profiles"
import { useAuth } from "@/providers/AuthProvider";
import { useProfileActions } from "@/hooks";

export const ProfileHeader = ({ userId }: { userId: string }) => {
  const { user } = useAuth()
  const { follow, unfollow, isFollowing } = useProfileActions(userId)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const isCurrentUser = userId === user?.id

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfileById(userId),
    enabled: !!userId
  })

  if (isLoading) return <ActivityIndicator />
  if (error) return <Text className="text-white">Error: {error.message}</Text>

  const unfollowOptions = [
    {
      text: '取消追蹤',
      textClassName: 'text-red-500 font-bold',
      onPress: () => {
        unfollow()
        setIsModalVisible(false)
      }
    },
    {
      text: '取消',
      onPress: () => setIsModalVisible(false)
    }
  ]

  const handleUnFollow = () => {
    setIsModalVisible(true)
  }

  const handleFollowersPress = () => {
    if (isCurrentUser) {
      router.push('/(tabs)/myProfile/follows')
    } else {
      router.push({
        pathname: '/profiles/follows',
        params: { user_id: userId, username: profile?.username }
      })
    }
  }

  return (
    <View className="p-4 gap-4">
      <View className="flex-row items-center justify-between gap-2">
        <View>
          <Text className="text-white text-2xl font-bold">
            {profile?.full_name}
          </Text>
          <Text className="text-neutral-200 text-lg">{profile?.username}</Text>
        </View>
        <SupabaseImage
          bucket="avatars"
          path={profile?.avatar_url}
          className="w-16 h-16 rounded-full bg-neutral-600/50"
          transform={{ width: 80, height: 80 }}
        />
      </View>
      {profile?.bio && (
        <Text className="text-white text-lg leading-snug">
          {profile?.bio}
        </Text>
      )}
      <Pressable onPress={handleFollowersPress}>
        <Text className="text-neutral-600 text-lg leading-snug font-bold">
          {profile?.followers_count} 粉絲
        </Text>
      </Pressable>
      {isCurrentUser ? (
        <View className="flex-row gap-2">
          <Link href="/myProfile/edit" asChild>
            <Pressable className="flex-1 py-2 rounded-xl border-2 border-neutral-800">
              <Text className="text-white text-center">編輯個人檔案</Text>
            </Pressable>
          </Link>
          <Pressable className="flex-1 py-2 rounded-xl border-2 border-neutral-800">
            <Text className="text-white text-center">分享個人檔案</Text>
          </Pressable>
        </View>
      ) : (
        <View className="flex-row gap-2">
          {isFollowing ? (
            <Pressable className="flex-1 py-2 rounded-xl border-2 border-neutral-800" onPress={handleUnFollow}>
              <Text className="text-neutral-500 text-center">追蹤中</Text>
            </Pressable>
          ) : (
            <Pressable className="flex-1 py-2 rounded-xl border-2 border-white bg-white" onPress={() => follow()}>
              <Text className="text-black text-center">追蹤</Text>
            </Pressable>
          )}
          <Pressable className="flex-1 py-2 rounded-xl border-2 border-neutral-800">
            <Text className="text-white text-center">提及</Text>
          </Pressable>
        </View>
      )}
      <ConfirmModal
        isVisible={isModalVisible}
        avatar={profile?.avatar_url}
        message={`取消追蹤${profile?.username}？`}
        options={unfollowOptions}
        onBackdropPress={() => setIsModalVisible(false)}
      />
    </View>
  )
}
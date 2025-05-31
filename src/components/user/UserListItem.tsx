import { useState } from "react"
import { View, Text, Pressable } from "react-native"
import { router } from "expo-router"

import { SupabaseImage } from "../media"
import { ConfirmModal } from "../common"
import { useProfileActions } from "@/hooks"
import { useAuth } from "@/providers/AuthProvider"
import { Tables } from "@/types/database.types"

interface UserListItemProps {
  isCurrentUser: boolean
  user: Tables<'profiles'> & { profiles: Tables<'profiles'> }
}

export const UserListItem = ({ isCurrentUser, user }: UserListItemProps) => {
  const { user: currentUser } = useAuth()
  const { follow, unfollow, isFollowing } = useProfileActions(user?.profiles?.id)
  const [isModalVisible, setIsModalVisible] = useState(false)  

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

  const handlePress = () => {
    if (user?.profiles?.id === currentUser?.id) {
      router.push('/myProfile')
    } else {
      router.push({
        pathname: '/profiles',
        params: { id: user?.profiles?.id }
      })
    }
  }

  return (
    <View className="flex-row items-center justify-between">
      <Pressable className="flex-row items-center gap-4" onPress={handlePress}>
        <SupabaseImage
          bucket="avatars"
          path={user?.profiles?.avatar_url ?? ''}
          className="w-10 h-10 rounded-full"
          transform={{ width: 40, height: 40 }}
        />
        <View className="gap-2">
          <Text className="text-white font-bold">{user?.profiles?.username}</Text>
          <Text className="text-gray-400">{user?.profiles?.full_name}</Text>
        </View>
      </Pressable>
      {(isCurrentUser && (currentUser?.id !== user?.profiles?.id)) && (
        isFollowing ? (
          <Pressable className="rounded-xl w-28 h-9 items-center justify-center border border-neutral-800" onPress={() => setIsModalVisible(true)}>
            <Text className="text-neutral-400">已追蹤</Text>
          </Pressable>
        ) : (
          <Pressable className="bg-white rounded-xl w-28 h-9 items-center justify-center" onPress={() => follow()}>
            <Text className="text-black">追蹤</Text>
          </Pressable>
        )
      )}
      <ConfirmModal
        isVisible={isModalVisible}
        avatar={user?.profiles?.avatar_url!}
        message={`取消追蹤${user?.profiles?.username}？`}
        options={unfollowOptions}
        onBackdropPress={() => setIsModalVisible(false)}
      />
    </View>
  )
} 
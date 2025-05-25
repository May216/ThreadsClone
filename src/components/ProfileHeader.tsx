import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";

import { SupabaseImage } from "./SupabaseImage";
import { getProfileById } from "@/services/profiles"
import { useAuth } from "@/providers/AuthProvider";

export const ProfileHeader = () => {
  const { user } = useAuth()

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => getProfileById(user?.id!),
    enabled: !!user?.id
  })

  if (isLoading) return <ActivityIndicator />
  if (error) return <Text className="text-white">Error: {error.message}</Text>

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
          className="w-16 h-16 rounded-full"
          transform={{ width: 80, height: 80 }}
        />
      </View>
      <Text className="text-white text-lg leading-snug">
        {profile?.bio}
      </Text>
      <View className="flex-row gap-2">
        <Link href="/(profile)/edit" asChild>
          <Pressable className="flex-1 py-2 rounded-lg border-2 border-neutral-800">
            <Text className="text-white text-center">編輯個人檔案</Text>
          </Pressable>
        </Link>
        <Pressable className="flex-1 py-2 rounded-lg border-2 border-neutral-800">
          <Text className="text-white text-center">分享個人檔案</Text>
        </Pressable>
      </View>
    </View>
  )
}
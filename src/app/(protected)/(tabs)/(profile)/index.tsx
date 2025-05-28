import React from "react"
import { View, Text, ActivityIndicator, FlatList } from "react-native"
import { useQuery } from "@tanstack/react-query"

import { PostListItem, ProfileHeader } from "@/components"
import { useAuth } from "@/providers/AuthProvider"
import { getPostsByUserId } from "@/services/posts"

export default function ProfileScreen() {
  const { user } = useAuth()

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts', { user_id: user?.id }],
    queryFn: () => getPostsByUserId(user?.id!),
    enabled: !!user?.id
  })

  if (isLoading) return <ActivityIndicator />
  if (error) return <Text className="text-white">Error: {error.message}</Text>

  return (
    <View className="flex-1 justify-center">
      <FlatList
        keyExtractor={(item) => item.id}
        data={posts}
        contentContainerClassName="w-full"
        ListHeaderComponent={() => (
          <React.Fragment>
            <ProfileHeader />
            <Text className="text-white text-lg font-bold mt-4 m-2">串文</Text>
          </React.Fragment>
        )}
        renderItem={({ item }) => <PostListItem post={item} />}
      />
      {/* <Text
        className="text-2xl font-bold text-white"
        onPress={() => supabase.auth.signOut()}
      >
        登出
      </Text> */}
    </View>
  )
}
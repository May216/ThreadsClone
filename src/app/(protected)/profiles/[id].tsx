import React from "react"
import { View, Text, ActivityIndicator, FlatList } from "react-native"
import { useQuery } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"

import { PostListItem, ProfileHeader } from "@/components"
import { getPostsByUserId } from "@/services/posts"

export default function ProfileScreen() {
  const params = useLocalSearchParams<{ id: string }>()

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts', { user_id: params.id }],
    queryFn: () => getPostsByUserId(params.id),
    enabled: !!params.id
  })

  if (isLoading) return <ActivityIndicator />
  if (error) return <Text className="text-white">Error: {error.message}</Text>

  return (
    <View className="flex-1 justify-center">
      <FlatList
        keyExtractor={(item) => item.id}
        data={posts?.filter(post => ['post', 'quote'].includes(post.post_type))}
        contentContainerClassName="w-full"
        ListHeaderComponent={() => (
          <React.Fragment>
            <ProfileHeader userId={params.id} />
            <Text className="text-white text-lg font-bold mt-4 m-2">串文</Text>
          </React.Fragment>
        )}
        renderItem={({ item }) => <PostListItem post={item} />}
      />
    </View>
  )
}
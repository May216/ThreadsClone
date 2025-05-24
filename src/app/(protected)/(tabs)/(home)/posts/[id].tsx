import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { PostListItem, PostReplyInput } from "@/components";
import { getPostById, getPostReplies } from "@/services/postsService";

export default function PostDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['posts', id],
    queryFn: () => getPostById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  })

  const { data: replies } = useQuery({
    queryKey: ['posts', id, 'replies'],
    queryFn: () => getPostReplies(id),
    enabled: !!id,
  })

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (error) {
    return <Text>Error: {error.message}</Text>
  }

  return (
    <View className="flex-1">
      <FlatList
        data={replies || []}
        renderItem={({ item }) => <PostListItem post={item} />}
        ListHeaderComponent={<PostListItem post={post} />}
      />
      <PostReplyInput postId={id} />
    </View>
  );
}
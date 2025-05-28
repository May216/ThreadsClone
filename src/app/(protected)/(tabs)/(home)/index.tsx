import { ActivityIndicator, FlatList, Text, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { PostListItem } from '@/components';
import { fetchPosts } from '@/services/posts';

export default function HomeScreen() {
  const { data: posts, isLoading, error, isRefetching, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5,
  })

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (error) {
    return <Text>Error: {error.message}</Text>
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      contentContainerClassName="grow"
      refreshControl={
        <RefreshControl 
          refreshing={isRefetching} 
          onRefresh={refetch}
          colors={['#fff']}
          tintColor="#fff"
        />
      }
      renderItem={({ item }) => <PostListItem post={item} />}
    />
  );
}
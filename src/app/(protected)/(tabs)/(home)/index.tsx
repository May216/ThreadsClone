import React from 'react';
import { ActivityIndicator, FlatList, Text } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';

import { PostListItem } from '@/components';
import { fetchPosts } from '@/services/posts';

export default function HomeScreen() {
  const {
    data: posts,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length > 0 ? pages.length + 1 : undefined;
    },
  })

  if (error) {
    return <Text>Error: {error.message}</Text>
  }

  return (
    <FlatList
      data={posts?.pages.flatMap(page => page) || []}
      keyExtractor={(item) => item.id}
      contentContainerClassName="grow"
      renderItem={({ item }) => (
        <React.Fragment>
          {!!item.parent_id && <PostListItem post={item.parent} isLastInGroup={false} />}
          <PostListItem post={item} />
        </React.Fragment>
      )}
      onEndReachedThreshold={0.5}
      ListFooterComponent={({ distanceFromEnd }) => {        
        if (!distanceFromEnd) {
          return null;
        }
        return <ActivityIndicator />
      }}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }}
    />
  );
}
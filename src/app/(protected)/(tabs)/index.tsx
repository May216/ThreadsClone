import { ActivityIndicator, FlatList, Text } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { PostListItem } from '@/components';
import { supabase } from '@/lib/supabase';

const fetchPosts = async () => {
  const { data } = await supabase
    .from('posts')
    .select('*, user: profiles(*)')
    .order('created_at', { ascending: true })
    .throwOnError();
  return data;
}

export default function HomeScreen() {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
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
      ListHeaderComponent={() => (
        <Link href="/new" className="text-blue-500 p-4 text-center text-3xl">New Post</Link>
      )}
      renderItem={({ item }) => <PostListItem item={item} />}
    />
  );
}
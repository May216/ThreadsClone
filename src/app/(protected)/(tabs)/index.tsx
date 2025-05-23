import { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { PostListItem } from '@/components';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types';

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from('posts').select('*, user: profiles(*)');
      if (error) {
        console.error(error);
        return;
      }
      setPosts(data);
    }
    fetchPosts();
  }, []);

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
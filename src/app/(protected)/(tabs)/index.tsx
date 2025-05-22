import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { PostListItem } from '@/components';
import { dummyPosts } from '@/dummyData';

export default function HomeScreen() {
  return (
    <FlatList
      data={dummyPosts}
      ListHeaderComponent={() => (
        <Link href="/new" className="text-blue-500 p-4 text-center text-3xl">New Post</Link>
      )}
      renderItem={({ item }) => <PostListItem item={item} />}
    />
  );
}
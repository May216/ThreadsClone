import { FlatList } from 'react-native';
import { PostListItem } from '@/components';
import { dummyPosts } from '@/dummyData';

export default function HomeScreen() {
  return (
    <FlatList
      data={dummyPosts}
      renderItem={({ item }) => <PostListItem item={item} />}
    />
  );
}
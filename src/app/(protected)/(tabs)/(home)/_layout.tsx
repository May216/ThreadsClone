import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ title: '首頁' }} />
      <Stack.Screen name='posts/[id]' options={{ title: '串文', headerBackButtonDisplayMode: 'generic' }} />
    </Stack>
  );
}
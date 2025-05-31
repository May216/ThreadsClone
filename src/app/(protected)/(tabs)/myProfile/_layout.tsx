import { Stack } from "expo-router";

export default function MyProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: '個人檔案' }} />
      <Stack.Screen name="edit" options={{ title: '編輯個人檔案' }} />
      <Stack.Screen name="follows" options={{ headerBackButtonDisplayMode: 'minimal' }} />
    </Stack>
  )
}
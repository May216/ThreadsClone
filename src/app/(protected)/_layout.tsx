import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="profiles"
        options={{
          headerTitle: '',
          headerBackButtonDisplayMode: 'minimal'
        }}
      />
      <Stack.Screen
        name="newPost"
        options={{
          title: '新串文',
          presentation: 'modal',
          animation: 'fade_from_bottom',
        }}
      />
      <Stack.Screen
        name="updatePost"
        options={{
          title: '編輯串文',
          presentation: 'modal',
          animation: 'fade_from_bottom',
        }}
      />
    </Stack>
  )
}
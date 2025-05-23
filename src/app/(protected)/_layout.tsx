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
        name="new"
        options={{
          title: 'New Thread',
          presentation: 'modal',
          animation: 'fade_from_bottom',
        }}
      />
    </Stack>
  )
}
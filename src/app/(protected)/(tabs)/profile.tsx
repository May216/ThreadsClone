import { View, Text } from "react-native"
import { supabase } from "@/lib/supabase"

export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text
        className="text-2xl font-bold text-white"
        onPress={() => supabase.auth.signOut()}
      >
        登出
      </Text>
    </View>
  )
}
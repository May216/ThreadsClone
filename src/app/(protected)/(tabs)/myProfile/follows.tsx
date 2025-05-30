import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function MyProfileFollowsScreen() {
  const params = useLocalSearchParams<{ user_id: string }>()
  const user_id = params.user_id
  return (
    <View>
      <Text>Follows</Text>
    </View>
  )
}
import React from "react"
import { ScrollView } from "react-native"
import { useLocalSearchParams } from "expo-router"
import { ProfileHeader, ProfileTabs } from "@/components"

export default function ProfileScreen() {
  const params = useLocalSearchParams<{ id: string }>()
  const userId = params.id

  return (
    <ScrollView className="flex-1">
      <ProfileHeader userId={userId} />
      <ProfileTabs userId={userId} />
    </ScrollView>
  )
}
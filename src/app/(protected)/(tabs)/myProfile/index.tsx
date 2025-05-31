import React from "react"
import { ScrollView } from "react-native"

import { ProfileHeader, ProfileTabs } from "@/components"
import { useAuth } from "@/providers/AuthProvider"

export default function MyProfileScreen() {
  const { user } = useAuth()

  return (
    <ScrollView className="flex-1">
      <ProfileHeader userId={user?.id!} />
      <ProfileTabs userId={user?.id!} />
    </ScrollView>
  )
}
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "expo-router";

import { Tabs, UserListItem } from "@/components";
import { useAuth } from "@/providers/AuthProvider";
import { getUserFollowers, getUserFollowing } from "@/services/follows";

export default function MyProfileFollowsScreen() {
  const navigation = useNavigation()
  const { profile } = useAuth()

  useEffect(() => {
    navigation.setOptions({
      title: profile?.username
    })
  }, [navigation])

  const { data: followers, isLoading: isFollowersLoading } = useQuery({
    queryKey: ['followers', profile?.id],
    queryFn: () => getUserFollowers(profile?.id!),
  })

  const { data: following, isLoading: isFollowingLoading } = useQuery({
    queryKey: ['following', profile?.id],
    queryFn: () => getUserFollowing(profile?.id!),
  })

  const tabs = [
    {
      label: `粉絲(${followers?.length})`,
      key: 'followers',
      content: (
        <View className="p-4 gap-4">
          {isFollowersLoading ? <ActivityIndicator /> : (
            followers?.map(follower => (
              <React.Fragment key={follower.created_at}>
                <UserListItem isCurrentUser={true} user={follower} />
                <View className="h-[1px] bg-neutral-800" />
              </React.Fragment>
            ))
          )}
        </View>
      )
    }, {
      label: `追蹤名單(${following?.length})`,
      key: 'following',
      content: (
        <View className="p-4 gap-4">
          {isFollowingLoading ? <ActivityIndicator /> : (
            following?.map(following => (
              <React.Fragment key={following.created_at}>
                <UserListItem isCurrentUser={true} user={following} />
                <View className="h-[1px] bg-neutral-800" />
              </React.Fragment>
            ))
          )}
        </View>
      )
    }
  ]
  return <Tabs tabs={tabs} />
}
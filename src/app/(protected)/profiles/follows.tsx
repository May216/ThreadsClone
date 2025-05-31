import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";

import { Tabs, UserListItem } from "@/components";
import { getUserFollowers, getUserFollowing } from "@/services/follows";

export default function ProfileFollowsScreen() {
  const navigation = useNavigation()
  const params = useLocalSearchParams<{ user_id: string, username: string }>()
  const user_id = params.user_id
  const username = params.username

  useEffect(() => {
    navigation.setOptions({
      title: username
    })
  }, [navigation])

  const { data: followers, isLoading: isFollowersLoading } = useQuery({
    queryKey: ['followers', user_id],
    queryFn: () => getUserFollowers(user_id),
  })

  const { data: following, isLoading: isFollowingLoading } = useQuery({
    queryKey: ['following', user_id],
    queryFn: () => getUserFollowing(user_id),
  })

  const tabs = [
    {
      label: `粉絲(${followers?.length})`,
      key: 'followers',
      content: (
        <View className="p-4 gap-4">
          {isFollowersLoading ? <ActivityIndicator /> : (
            followers?.map(follower => (
              <React.Fragment key={follower.id}>
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
              <React.Fragment key={following.id}>
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
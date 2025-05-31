import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useQuery } from "@tanstack/react-query";

import { Tabs } from "../common";
import { PostListItem } from "../post";
import { getPostsByUserId, getUserReposts } from "@/services/posts";
import { PostWithUser } from "@/types/post";

export const ProfileTabs = ({ userId }: { userId: string }) => {
  const { data: posts, isLoading } = useQuery<PostWithUser[]>({
    queryKey: ['posts', { user_id: userId }],
    queryFn: () => getPostsByUserId(userId),
    enabled: !!userId
  })

  const { data: reposts, isLoading: isRepostsLoading } = useQuery<PostWithUser[]>({
    queryKey: ['reposts', { user_id: userId }],
    queryFn: () => getUserReposts(userId),
    enabled: !!userId
  })

  const tabs = [
    {
      label: '串文',
      key: 'posts',
      content: (
        <View>
          {isLoading ? <ActivityIndicator /> : (
            posts?.filter(post => ['post', 'quote'].includes(post.post_type)).map(post => (
              <PostListItem key={post.id} post={post} />
            ))
          )}
        </View>
      )
    }, {
      label: '回覆',
      key: 'replies',
      content: (
        <View>
          {isLoading ? <ActivityIndicator /> : (
            posts?.filter(post => post.post_type === 'reply').map(post => (
              <PostListItem key={post.id} post={post} />
            ))
          )}
        </View>
      )
    }, {
      label: '影音內容',
      key: 'videos',
      content: (
        <View>
          {isLoading ? <ActivityIndicator /> : (
            posts?.filter(post => post.medias && post.medias.length > 0).map(post => (
              <PostListItem key={post.id} post={post} />
            ))
          )}
        </View>
      )
    }, {
      label: '轉發',
      key: 'reposts',
      content: (
        <View>
          {isRepostsLoading ? <ActivityIndicator /> : (
            reposts?.map(post => (
              <PostListItem key={post.id} post={post} />
            ))
          )}
        </View>
      )
    }
  ]
  return <Tabs tabs={tabs} />
};
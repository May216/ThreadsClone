import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Animated, Dimensions, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";

import { PostListItem } from "../post";
import { getPostsByUserId, getUserReposts } from "@/services/posts";
import { PostWithUser } from "@/types/post";

const tabs = ["串文", "回覆", "影音內容", "轉發"];
const screenWidth = Dimensions.get("window").width;

export const ProfileTabs = ({ userId }: { userId: string }) => {
  const [activeTab, setActiveTab] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const { data: posts, isLoading } = useQuery<PostWithUser[]>({
    queryKey: ['posts', { user_id: userId }],
    queryFn: () => getPostsByUserId(userId),
    enabled: !!userId
  })

  const { data: reposts, isLoading: repostsLoading } = useQuery<PostWithUser[]>({
    queryKey: ['reposts', { user_id: userId }],
    queryFn: () => getUserReposts(userId),
    enabled: !!userId
  })

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    Animated.spring(translateX, {
      toValue: (screenWidth / tabs.length) * index,
      useNativeDriver: true,
    }).start();
  };

  const TabContent = () => {
    if (isLoading || repostsLoading) return <ActivityIndicator />
    if (posts?.length === 0) return <Text>暫無串文</Text>
    switch (activeTab) {
      case 0:
        return (
          <View>
            {posts?.filter(post => ['post', 'quote'].includes(post.post_type)).map(post => (
              <React.Fragment key={post.id}>
                {!!post.parent_id && <PostListItem post={post.parent!} isLastInGroup={false} />}
                <PostListItem post={post} />
              </React.Fragment>
            ))}
          </View>
        )
      case 1:
        return (
          <View>
            {posts?.filter(post => post.post_type === 'reply').map(post => (
              <React.Fragment key={post.id}>
                {!!post.parent_id && <PostListItem post={post.parent!} isLastInGroup={false} />}
                <PostListItem post={post} />
              </React.Fragment>
            ))}
          </View>
        )
      case 2:
        return (
          <View>
            {posts?.filter(post => post.medias && post.medias.length > 0).map(post => (
              <React.Fragment key={post.id}>
                {!!post.parent_id && <PostListItem post={post.parent!} isLastInGroup={false} />}
                <PostListItem post={post} />
              </React.Fragment>
            ))}
          </View>
        )
      case 3:
        return (
          <View>
            {reposts?.map(post => (
              <PostListItem key={post.id} post={post} />
            ))}
          </View>
        )
      default:
        return null
    }
  }

  return (
    <View>
      {/* Tabs */}
      <View className="flex-row relative">
        {tabs.map((tab, idx) => (
          <TouchableOpacity
            key={tab}
            className="flex-1 items-center py-4"
            onPress={() => handleTabPress(idx)}
            activeOpacity={0.7}
          >
            <Text className={`text-base font-bold ${activeTab === idx ? "text-white" : "text-gray-400"}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
        {/* Animated underline */}
        <Animated.View
          className="absolute h-0.5 bg-white bottom-0 left-0"
          style={{
            width: screenWidth / tabs.length,
            transform: [{ translateX }],
          }}
        />
      </View>
      {/* Tab Content */}
      <TabContent />
    </View>
  );
};
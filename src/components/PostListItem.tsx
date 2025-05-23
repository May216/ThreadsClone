import { memo, useCallback } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Link } from "expo-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { InteractionButton } from "./InteractionButton";
import { Post } from "@/types";

dayjs.extend(relativeTime);

export const PostListItem = memo(({ post }: { post: Post }) => {
  const handleReply = useCallback(() => {
    console.log('Reply to post:', post.id);
  }, [post.id]);

  const handleRepost = useCallback(() => {
    console.log('Repost:', post.id);
  }, [post.id]);

  const handleLike = useCallback(() => {
    console.log('Like post:', post.id);
  }, [post.id]);

  const handleShare = useCallback(() => {
    console.log('Share post:', post.id);
  }, [post.id]);

  return (
    <Link href={`posts/${post.id}`} asChild>
      <Pressable
        className="flex-row p-4 border-b border-gray-800/70"
        accessibilityRole="none"
        accessibilityLabel={`Post by ${post.user.username}`}
      >
        {/* avatar */}
        <Image
          source={{ uri: post.user.avatar_url }}
          className="w-12 h-12 rounded-full"
          accessibilityLabel={`${post.user.username}'s profile picture`}
        />

        {/* content area */}
        <View className="flex-1 ml-3">
          {/* user info */}
          <View className="flex-row items-center gap-3">
            <Text className="text-white font-bold text-base">{post.user.username}</Text>
            <Text className="text-gray-500">
              {dayjs(post.createdAt).fromNow()}
            </Text>
          </View>

          {/* post content */}
          <Text className="text-white mt-2 leading-6 text-base">{post.content}</Text>

          {/* interaction buttons */}
          <View className="flex-row mt-4 gap-6">
            <InteractionButton
              icon="heart-outline"
              count={0}
              onPress={handleLike}
              accessibilityLabel="Like"
            />
            <InteractionButton
              icon="chatbubble-outline"
              count={0}
              onPress={handleReply}
              accessibilityLabel={`Reply to ${post.user.username}'s post`}
            />
            <InteractionButton
              icon="repeat-outline"
              count={0}
              accessibilityLabel="Repost"
              onPress={handleRepost}
            />
            <InteractionButton
              icon="paper-plane-outline"
              onPress={handleShare}
              accessibilityLabel="Share"
            />
          </View>
        </View>
      </Pressable>
    </Link>
  );
});
import { memo, useCallback } from "react";
import { View, Text, Image } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { InteractionButton } from "./InteractionButton";
import { Post } from "@/types";

dayjs.extend(relativeTime);

export const PostListItem = memo(({ item }: { item: Post }) => {
  const handleReply = useCallback(() => {
    console.log('Reply to post:', item.id);
  }, [item.id]);

  const handleRepost = useCallback(() => {
    console.log('Repost:', item.id);
  }, [item.id]);

  const handleLike = useCallback(() => {
    console.log('Like post:', item.id);
  }, [item.id]);

  const handleShare = useCallback(() => {
    console.log('Share post:', item.id);
  }, [item.id]);

  return (
    <View
      className="flex-row p-4 border-b border-gray-800/70"
      accessibilityRole="none"
      accessibilityLabel={`Post by ${item.user.name}`}
    >
      {/* avatar */}
      <Image
        source={{ uri: item.user.image }}
        className="w-12 h-12 rounded-full"
        accessibilityLabel={`${item.user.name}'s profile picture`}
      />

      {/* content area */}
      <View className="flex-1 ml-3">
        {/* user info */}
        <View className="flex-row items-center gap-3">
          <Text className="text-white font-bold text-base">{item.user.name}</Text>
          <Text className="text-gray-500">
            {dayjs(item.createdAt).fromNow()}
          </Text>
        </View>

        {/* post content */}
        <Text className="text-white mt-2 leading-6 text-base">{item.content}</Text>

        {/* interaction buttons */}
        <View className="flex-row mt-4 gap-6">
          <InteractionButton
            icon="heart-outline"
            count={item.likes}
            onPress={handleLike}
            accessibilityLabel="Like"
          />
          <InteractionButton
            icon="chatbubble-outline"
            count={item.replies.length}
            onPress={handleReply}
            accessibilityLabel={`Reply to ${item.user.name}'s post`}
          />
          <InteractionButton
            icon="repeat-outline"
            count={item.shares}
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
    </View>
  );
});
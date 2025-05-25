import { memo, useCallback } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Link } from "expo-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { InteractionButton } from "./InteractionButton";
import { Video } from "./Video";
import { SupabaseImage } from "./SupabaseImage";
import { Tables } from "@/types/database.types";
import { supabase } from "@/lib/supabase";

dayjs.extend(relativeTime);

type PostWithUser = Tables<'posts'> & {
  user: Tables<'profiles'>;
  replies: {
    count: number;
  }[];
}

export const PostListItem = memo(({ post, isLastInGroup = true }: { post: PostWithUser, isLastInGroup?: boolean }) => {
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
        className={`flex-row p-4 ${isLastInGroup ? 'border-b border-gray-800/70' : ''}`}
        accessibilityRole="none"
        accessibilityLabel={`Post by ${post.user.username}`}
      >
        {/* avatar */}
        <View className='mr-3 items-center gap-2'>
          <SupabaseImage
            bucket="avatars"
            path={post.user.avatar_url!}
            className='w-12 h-12 rounded-full'
          />
          {!isLastInGroup && (
            <View className="w-[3px] flex-1 rounded-full bg-neutral-700 translate-y-2" />
          )}
        </View>

        {/* content area */}
        <View className="flex-1">
          {/* user info */}
          <View className="flex-row items-center">
            <Text className="text-white font-bold mr-2">{post.user.username}</Text>
            <Text className="text-gray-500">
              {dayjs(post.created_at).fromNow()}
            </Text>
          </View>

          {/* post content */}
          <Text className="text-white mt-2 mb-3">{post.content}</Text>

          {/* medias */}
          {post.medias?.length && (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="my-4"
            >
              <View className="flex-row gap-4" onStartShouldSetResponder={() => true}>
                {post.medias?.map((media) => {
                  const uri = supabase.storage.from('media').getPublicUrl(media).data.publicUrl;
                  return media.includes('.mp4') ? (
                    <Video
                      key={media}
                      uri={uri}
                      className="w-64 h-80 rounded-lg"
                    />
                  ) : (
                    <SupabaseImage
                      key={media}
                      bucket="media"
                      path={media}
                      className="w-64 h-80 rounded-lg"
                    />
                  )
                })}
              </View>
            </ScrollView>
          )}

          {/* interaction buttons */}
          <View className="flex-row gap-6 mt-2">
            <InteractionButton
              icon="heart-outline"
              count={0}
              onPress={handleLike}
              accessibilityLabel="Like"
            />
            <InteractionButton
              icon="chatbubble-outline"
              count={post.replies?.[0].count || 0}
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
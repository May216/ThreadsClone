import { memo, useCallback } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Link } from "expo-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { InteractionButton } from "./InteractionButton";
import { Video } from "./Video";
import { SupabaseImage } from "./SupabaseImage";
import { Tables } from "@/types/database.types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { toggleLike, getPostLikes, getUserLikeStatus } from "@/services/interactions";

dayjs.extend(relativeTime);

type PostWithUser = Tables<'posts'> & {
  user: Tables<'profiles'>;
  replies: {
    count: number;
  }[];
}

export const PostDetails = memo(({ post }: { post: PostWithUser }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: likes } = useQuery({
    queryKey: ['likes', post.id],
    queryFn: () => getPostLikes(post.id)
  });

  const { data: hasLiked } = useQuery({
    queryKey: ['userLike', post.id, user?.id],
    queryFn: () => getUserLikeStatus(post.id, user!.id),
    enabled: !!user
  });

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(post.id, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes', post.id] });
      queryClient.invalidateQueries({ queryKey: ['userLike', post.id, user?.id] });
    }
  });

  const handleReply = useCallback(() => {
    console.log('Reply to post:', post.id);
  }, [post.id]);

  const handleRepost = useCallback(() => {
    console.log('Repost:', post.id);
  }, [post.id]);

  const handleShare = useCallback(() => {
    console.log('Share post:', post.id);
  }, [post.id]);

  return (
    <Link href={`posts/${post.id}`} asChild>
      <Pressable
        className="p-4 border-b border-gray-800/70 gap-4"
        accessibilityRole="none"
        accessibilityLabel={`Post by ${post.user.username}`}
      >
        {/* user info */}
        <View className="flex-1 flex-row items-center gap-3">
          {/* avatar */}
          <SupabaseImage
            bucket="avatars"
            path={post.user.avatar_url!}
            className='w-12 h-12 rounded-full'
            transform={{ width: 48, height: 48 }}
          />
          <Text className="text-white font-bold">
            {post.user.username}
          </Text>
          <Text className="text-gray-500">
            {dayjs(post.created_at).fromNow()}
          </Text>
        </View>
        {/* post content */}
        <View className="flex-1">
          <Text className="text-white">
            {post.content}
          </Text>
        </View>
        {/* medias */}
        {post.medias?.length && (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
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
                    transform={{ width: 300, height: 300 }}
                  />
                )
              })}
            </View>
          </ScrollView>
        )}
        {/* interaction buttons */}
        <View className="flex-row gap-6">
          <InteractionButton
            icon={hasLiked ? "heart" : "heart-outline"}
            count={likes?.length || 0}
            accessibilityLabel={hasLiked ? "取消點讚" : "點讚"}
            color={hasLiked ? "#ff3b30" : undefined}
            onPress={() => likeMutation.mutate()}
          />
          <InteractionButton
            icon="chatbubble-outline"
            count={post.replies?.[0].count || 0}
            accessibilityLabel={`回覆 ${post.user.username} 的貼文`}
            onPress={handleReply}
          />
          <InteractionButton
            icon="repeat-outline"
            count={0}
            accessibilityLabel="轉發"
            onPress={handleRepost}
          />
          <InteractionButton
            icon="paper-plane-outline"
            onPress={handleShare}
            accessibilityLabel="分享"
          />
        </View>
      </Pressable>
    </Link>
  );
});
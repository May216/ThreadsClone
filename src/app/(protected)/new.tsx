import { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Entypo } from "@expo/vector-icons";

import { useAuth } from "@/providers/AuthProvider";
import { ImagePreview, QuotePost, SupabaseImage, VideoPreview } from "@/components";
import { getPostById } from "@/services/posts";
import { useMediaUpload, useCreatePost } from "@/hooks";

export default function NewPostScreen() {
  const params = useLocalSearchParams<{ parent_id: string, post_type: string }>();
  const parentId = params.parent_id;
  const postType = params.post_type;

  const { profile } = useAuth();
  const [text, setText] = useState('');
  
  const { medias, pickMedia, removeMedia, uploadAllMedia } = useMediaUpload();
  const { createPost, isCreating, error } = useCreatePost();

  const { data: parentPost } = useQuery({
    queryKey: ['post', parentId],
    queryFn: () => getPostById(parentId),
    enabled: !!parentId
  });

  const handlePost = async () => {
    const mediaUrls = await uploadAllMedia();
    createPost({
      content: text,
      postType: postType as 'post' | 'quote',
      parentId,
      mediaUrls
    });
  };

  return (
    <SafeAreaView className="p-4 flex-1" edges={['bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 0}
      >
        <View className="flex-row gap-4">
          <View className='mr-3 items-center gap-2'>
            <SupabaseImage
              bucket="avatars"
              path={profile?.avatar_url!}
              className="w-12 h-12 rounded-full"
              transform={{ width: 48, height: 48 }}
            />
            {postType === 'quote' && (
              <View className="w-[3px] flex-1 rounded-full bg-neutral-700 translate-y-2" />
            )}
          </View>
          <View className="flex-1">
            <Text className="text-white text-xl font-bold">{profile?.username}</Text>
            {/* content */}
            <TextInput
              placeholder="有什麼新鮮事？"
              placeholderTextColor="gray"
              className="text-white text-lg"
              multiline
              numberOfLines={4}
              value={text}
              onChangeText={setText}
            />
            {error && (
              <View className="mt-4">
                <Text className="text-red-500">{error.message}</Text>
              </View>
            )}
            {/* medias */}
            <View>
              {medias.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
                  <View className="flex-row items-center gap-2">
                    {medias.map((media, index) => media.type === 'image' ? (
                      <ImagePreview
                        key={index}
                        uri={media.uri}
                        onPress={() => removeMedia(index)}
                      />
                    ) : (
                      <VideoPreview
                        key={index}
                        uri={media.uri}
                        onPress={() => removeMedia(index)}
                      />
                    ))}
                  </View>
                </ScrollView>
              )}
              <View className="flex-row items-center gap-2 mt-4">
                <Entypo name="images" size={20} color="gray" onPress={pickMedia} />
              </View>
            </View>
            {postType === 'quote' && (
              <QuotePost post={parentPost} />
            )}
          </View>
        </View>
        {/* post button */}
        <View className="mt-auto">
          <Pressable
            className={`p-3 px-6 self-end rounded-full ${isCreating ? 'bg-white/50' : 'bg-white'}`}
            disabled={isCreating}
            onPress={handlePost}
          >
            {isCreating ? <ActivityIndicator /> : <Text>發佈</Text>}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
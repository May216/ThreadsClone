import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Entypo } from "@expo/vector-icons";

import { useAuth } from "@/providers/AuthProvider";
import { ImagePreview, QuotePost, SupabaseImage, VideoPreview } from "@/components";
import { getPostById } from "@/services/posts";
import { useMediaUpload } from "@/hooks";

const MAX_CHARACTERS = 200;

interface PostFormProps {
  isEdit?: boolean;
  initialContent?: string;
  parentId?: string;
  postId?: string;
  initialMedias?: string[] | string;
  isSubmitting: boolean;
  error?: Error;
  submitButtonText: string;
  onSubmit: (content: string, mediaUrls?: string[]) => Promise<void>;
}

export const PostForm = ({
  isEdit = false,
  parentId,
  initialContent = '',
  initialMedias,
  isSubmitting,
  error,
  submitButtonText,
  onSubmit,
}: PostFormProps) => {
  const { profile } = useAuth();
  const [text, setText] = useState(initialContent);
  const { medias, setMedias, pickMedia, removeMedia, uploadAllMedia, deleteRemovedMedias } = useMediaUpload();
  const isDisabled = isSubmitting || (!text && medias.length === 0) || text.length > MAX_CHARACTERS;
  const characterCount = text.length;
  const isOverLimit = characterCount > MAX_CHARACTERS;
  const overLimitCount = isOverLimit ? characterCount - MAX_CHARACTERS : 0;

  useEffect(() => {
    if (initialContent) {
      setText(initialContent);
    }
  }, [initialContent]);

  useEffect(() => {
    if (initialMedias) {
      const initialMediaAssets = typeof initialMedias === 'string'
        ? JSON.parse(initialMedias)
        : initialMedias.map(filename => {
          const url = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${filename}`;
          return {
            uri: url,
            type: filename.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image' as const : 'video' as const,
            mimeType: filename.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image/jpeg' : 'video/mp4',
            width: 0,
            height: 0,
          };
        });
      setMedias(initialMediaAssets);
    }
  }, [initialMedias]);

  const { data: parentPost } = useQuery({
    queryKey: ['post', parentId],
    queryFn: () => getPostById(parentId!),
    enabled: !!parentId
  });

  const handleSubmit = async () => {
    try {
      await deleteRemovedMedias();
      const mediaUrls = await uploadAllMedia();
      await onSubmit(text, mediaUrls);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
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
            {!!parentId && (
              <View className="w-[3px] flex-1 rounded-full bg-neutral-700 translate-y-2" />
            )}
          </View>
          <View className="flex-1">
            <Text className="text-white text-xl font-bold">{profile?.username}</Text>
            {/* content */}
            <View>
              <TextInput
                placeholder={isEdit ? '編輯內容' : '有什麼新鮮事？'}
                placeholderTextColor="gray"
                multiline={true}
                numberOfLines={20}
                className="text-white"
                onChangeText={setText}
              >
                <Text className="text-lg">{text.slice(0, MAX_CHARACTERS)}</Text>
                {isOverLimit && (
                  <Text className="text-lg bg-amber-900/40">{text.slice(MAX_CHARACTERS)}</Text>
                )}
              </TextInput>
            </View>
            {isOverLimit && (
              <View className="mt-4">
                <Text className="text-lg text-red-500">
                  {`-${overLimitCount}`}
                </Text>
              </View>
            )}
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
            {!!parentId && (
              <QuotePost post={parentPost} />
            )}
          </View>
        </View>
        {/* submit button */}
        <View className="mt-auto">
          <Pressable
            className={`p-3 px-6 self-end rounded-full ${isDisabled ? 'bg-white/50' : 'bg-white'}`}
            disabled={isDisabled}
            onPress={handleSubmit}
          >
            {isSubmitting ? <ActivityIndicator /> : <Text>{submitButtonText}</Text>}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}; 
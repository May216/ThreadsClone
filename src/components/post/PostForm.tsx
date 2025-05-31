import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Entypo } from "@expo/vector-icons";
import { useNavigation, usePreventRemove } from '@react-navigation/native';
import { ImagePickerAsset } from "expo-image-picker";

import { useAuth } from "@/providers/AuthProvider";
import { ImagePreview, QuotePost, SupabaseImage, VideoPreview, ConfirmModal } from "@/components";
import { getPostById } from "@/services/posts";
import { useMediaUpload } from "@/hooks";
import { useDraftStore } from "@/stores/draftStore";
import { PostType } from "@/types/post";

const MAX_CHARACTERS = 200;

interface PostFormProps {
  isEdit?: boolean;
  initialContent?: string;
  parentId?: string;
  postId?: string;
  postType?: PostType;
  initialMedias?: string[] | string;
  isSubmitting: boolean;
  error?: Error;
  submitButtonText: string;
  onSubmit: (content: string, mediaUrls?: string[]) => Promise<void>;
}

export const PostForm = ({
  isEdit = false,
  postId,
  parentId,
  postType,
  initialContent = '',
  initialMedias,
  isSubmitting,
  error,
  submitButtonText,
  onSubmit,
}: PostFormProps) => {
  const navigation = useNavigation();
  const { profile } = useAuth();
  const { addDraft } = useDraftStore();
  const { medias, setMedias, pickMedia, removeMedia, uploadAllMedia, deleteRemovedMedias } = useMediaUpload();

  const [text, setText] = useState(initialContent);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);

  const hasUnsavedChanges = !isSubmitting && (text !== initialContent || medias.length > 0);
  const isDisabled = isSubmitting || (!text && medias.length === 0) || text.length > MAX_CHARACTERS;
  const characterCount = text.length;
  const isOverLimit = characterCount > MAX_CHARACTERS;
  const overLimitCount = isOverLimit ? characterCount - MAX_CHARACTERS : 0;

  usePreventRemove(hasUnsavedChanges, ({ data }) => {
    setPendingAction(data.action);
    setIsModalVisible(true);
  });

  useEffect(() => {
    if (initialContent) {
      setText(initialContent);
    }
  }, [initialContent]);

  useEffect(() => {
    if (initialMedias) {
      const initialMediaAssets = typeof initialMedias === 'string'
        ? JSON.parse(initialMedias)
        : initialMedias;
      const formattedMediaAssets = initialMediaAssets.map((item: string | ImagePickerAsset) => {
        if (typeof item === 'string') {
          const url = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${item}`;
          return {
            uri: url,
            type: item.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image' as const : 'video' as const,
            mimeType: item.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image/jpeg' : 'video/mp4',
            width: 0,
            height: 0,
          };
        } else {
          return item;
        }
      });
      setMedias(formattedMediaAssets);
    }
  }, [initialMedias]);

  const { data: parentPost } = useQuery({
    queryKey: ['post', parentId],
    queryFn: () => getPostById(parentId!),
    enabled: !!parentId
  });

  const handleSave = async () => {
    try {
      addDraft({
        content: text,
        medias,
        post_type: postType!,
        parentId,
        postId: isEdit ? postId : undefined,
      });
      setIsModalVisible(false);
      if (pendingAction) {
        navigation.dispatch(pendingAction);
      }
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const handleDiscard = () => {
    setIsModalVisible(false);
    if (pendingAction) {
      navigation.dispatch(pendingAction);
    }
  };

  const handleContinue = () => {
    setIsModalVisible(false);
  };

  const unsavedChangesOptions = [
    {
      text: '儲存',
      textClassName: 'text-blue-500 font-bold',
      onPress: handleSave,
    },
    {
      text: '不儲存',
      textClassName: 'text-red-500',
      onPress: handleDiscard,
    },
    {
      text: '繼續編輯',
      textClassName: 'text-white font-bold',
      onPress: handleContinue,
    }
  ]

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

      <ConfirmModal
        isVisible={isModalVisible}
        title="儲存為草稿？"
        message="儲存為草稿，以便稍後編輯和發佈。"
        options={unsavedChangesOptions}
        onBackdropPress={() => setIsModalVisible(false)}
      />
    </SafeAreaView>
  );
}; 
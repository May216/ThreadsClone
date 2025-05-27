import { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { ImagePickerAsset, launchImageLibraryAsync } from 'expo-image-picker';

import { useAuth } from "@/providers/AuthProvider";
import { createPost } from "@/services/posts";
import { ImagePreview, QuotePost, SupabaseImage, VideoPreview } from "@/components";
import { supabase } from "@/lib/supabase";
import { getPostById } from "@/services/posts";

export default function NewPostScreen() {
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ parent_id: string, post_type: string }>();
  const parentId = params.parent_id;
  const postType = params.post_type;

  const { user, profile } = useAuth();
  const [text, setText] = useState('');
  const [medias, setMedias] = useState<ImagePickerAsset[]>([]);

  const { data: parentPost } = useQuery({
    queryKey: ['post', parentId],
    queryFn: () => getPostById(parentId),
    enabled: !!parentId
  })

  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => await handlePost(),
    onSuccess: () => {
      setText('');
      setMedias([]);
      router.back();
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['reposts', parentId] });
    },
    onError: (error) => {
      console.error(error);
    }
  })

  const pickImage = async () => {
    let result = await launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 20,
      orderedSelection: true
    });

    if (!result.canceled) {
      setMedias(prevMedias => [...prevMedias, ...result.assets]);
    }
  };

  const uploadMedia = async (media: ImagePickerAsset) => {
    if (!media) return;
    const arraybuffer = await fetch(media.uri).then(res => res.arrayBuffer());
    const fileExt = media.uri?.split('.').pop()?.toLowerCase();
    const path = `${Date.now()}.${fileExt}`;
    const { data, error: uploadError } = await supabase.storage
      .from('media')
      .upload(path, arraybuffer, {
        contentType: media.mimeType
      });
    if (uploadError) {
      throw uploadError;
    }
    return data.path;
  }

  const handlePost = async () => {
    try {
      let imageUrls: string[] = [];
      if (medias.length > 0) {
        const mediaPromises = medias.map(uploadMedia);
        imageUrls = await Promise.all(mediaPromises) as string[];
      }
      if (postType === 'quote') {
        return createPost({
          post_type: 'quote',
          content: text,
          user_id: user!.id,
          parent_id: parentId,
          medias: imageUrls.length > 0 ? imageUrls : undefined
        });
      } else {
        return createPost({
          post_type: 'post',
          content: text,
          user_id: user!.id,
          medias: imageUrls.length > 0 ? imageUrls : undefined
        });
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

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
                        onPress={() => setMedias(medias.filter((_, i) => i !== index))}
                      />
                    ) : (
                      <VideoPreview
                        key={index}
                        uri={media.uri}
                        onPress={() => setMedias(medias.filter((_, i) => i !== index))}
                      />
                    ))}
                  </View>
                </ScrollView>
              )}
              <View className="flex-row items-center gap-2 mt-4">
                <Entypo name="images" size={20} color="gray" onPress={pickImage} />
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
            className={`p-3 px-6 self-end rounded-full ${isPending ? 'bg-white/50' : 'bg-white'}`}
            disabled={isPending}
            onPress={() => mutate()}
          >
            {isPending ? <ActivityIndicator /> : <Text>發佈</Text>}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
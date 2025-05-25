import { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { ImagePickerAsset, launchImageLibraryAsync } from 'expo-image-picker';

import { useAuth } from "@/providers/AuthProvider";
import { createPost } from "@/services/posts";
import { ImagePreview, VideoPreview } from "@/components";
import { supabase } from "@/lib/supabase";

export default function NewPostScreen() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [medias, setMedias] = useState<ImagePickerAsset[]>([]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      let imageUrls: string[] = [];
      if (medias.length > 0) {
        const mediaPromises = medias.map(uploadMedia);
        imageUrls = await Promise.all(mediaPromises) as string[];
      }
      return createPost({
        content: text,
        user_id: user!.id,
        medias: imageUrls.length > 0 ? imageUrls : undefined
      });
    },
    onSuccess: () => {
      setText('');
      router.back();
      return queryClient.invalidateQueries({ queryKey: ['posts'] });
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

  return (
    <SafeAreaView className="p-4 flex-1" edges={['bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 0}
      >
        <Text className="text-white text-2xl font-bold">username</Text>

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
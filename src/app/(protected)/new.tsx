import { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";

const createPost = async (content: string, user_id: string) => {
  const { data } = await supabase
    .from('posts')
    .insert({ user_id, content })
    .select()
    .throwOnError();

  return data;
}

export default function NewPostScreen() {
  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const { user } = useAuth();

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => createPost(text, user!.id),
    onSuccess: () => {
      setText('');
      router.back();
      return queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error(error);
    }
  })

  return (
    <SafeAreaView className="p-4 flex-1" edges={['bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 0}
      >
        <Text className="text-white text-2xl font-bold">username</Text>

        <TextInput
          placeholder="What's on your mind?"
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

        <View className="mt-auto">
          <Pressable
            className={`p-3 px-6 self-end rounded-full ${isPending ? 'bg-white/50' : 'bg-white'}`}
            disabled={isPending}
            onPress={() => mutate()}
          >
            {isPending ? <ActivityIndicator /> : <Text>Post</Text>}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
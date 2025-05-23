import { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";

export default function NewPostScreen() {
  const [text, setText] = useState('');
  const { user } = useAuth();

  const onSubmit = async () => {
    if (!text || !user) return;

    try {
      const { data, error } = await supabase.from('posts').insert({
        user_id: user?.id,
        content: text,
      });

      if (error) {
        console.error(error);
        return;
      }

      setText('');
    } catch (error) {
      console.error(error);
    }
  }

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

        <View className="mt-auto">
          <Pressable className="bg-white p-3 px-6 self-end rounded-full" onPress={onSubmit}>
            <Text>Post</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
import { useEffect, useState } from "react";
import { View, TextInput, Pressable } from "react-native";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

import { createPost } from "@/services/posts";
import { useAuth } from "@/providers/AuthProvider";
import { useMediaUpload } from "@/hooks";

export const PostReplyInput = ({ postId, postUser }: { postId: string | undefined, postUser: string | undefined }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { medias, pickMedia, setMedias } = useMediaUpload();
  const [text, setText] = useState('')

  useEffect(() => {
    if (medias.length > 0) {
      router.push({
        pathname: '/(protected)/newPost',
        params: {
          parent_id: postId,
          post_type: 'reply',
          initial_content: text,
          initial_medias: JSON.stringify(medias)
        }
      });
      setMedias([]);
    }
  }, [medias])

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await createPost({
        content: text,
        user_id: user!.id,
        parent_id: postId,
        post_type: 'reply'
      });
    },
    onSuccess: () => {
      setText('');
      return queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onError: (error) => {
      console.error(error);
    }
  })

  return (
    <View className="p-4 pt-0 flex-row items-center gap-2">
      <View className="flex-row items-center gap-2 bg-neutral-800 shadow-md px-4 rounded-xl flex-1 h-12">
        <TextInput
          placeholder={`回覆 ${postUser}`}
          placeholderTextColor="#A1A1AA"
          className="flex-1 text-white"
          value={text}
          multiline={true}
          numberOfLines={4}
          onChangeText={setText}
        />
        <Entypo name="images" size={20} color="gray" onPress={pickMedia} />
      </View>
      {text.length > 0 && (
        <Pressable className="bg-white rounded-full w-12 h-12 items-center justify-center" disabled={isPending} onPress={() => mutate()}>
          <AntDesign name="arrowup" size={20} color="black" />
        </Pressable>
      )}
    </View>
  );
};
import { useState } from "react";
import { View, TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createPost } from "@/services/postsService";
import { useAuth } from "@/providers/AuthProvider";

export const PostReplyInput = ({ postId }: { postId: string | undefined }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [text, setText] = useState('')

  const { mutate, isPending } = useMutation({
    mutationFn: () => createPost({ content: text, user_id: user!.id, parent_id: postId }),
    onSuccess: () => {
      setText('');
      return queryClient.invalidateQueries({ queryKey: ['posts', postId, 'replies'] });
    },
    onError: (error) => {
      console.error(error);
    }
  })

  return (
    <View className="p-4">
      <View className="flex-row items-center gap-2 bg-neutral-800 shadow-md p-4 rounded-xl">
        <TextInput
          placeholder="Add to thread..."
          placeholderTextColor="#A1A1AA"
          className="flex-1 text-white"
          value={text}
          multiline={true}
          numberOfLines={4}
          onChangeText={setText}
        />
        <AntDesign
          name="pluscircleo"
          size={24}
          color={text.length === 0 ? 'gray' : 'gainsboro'}
          disabled={isPending || text.length === 0}
          onPress={() => mutate()}
        />
      </View>
    </View>
  );
};
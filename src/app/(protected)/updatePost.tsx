import { useEffect } from "react";
import { Pressable } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

import { PostForm } from "@/components/post";
import { usePostActions } from "@/hooks";
import { getPostById } from "@/services/posts";

export default function EditPostScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ post_id: string, initial_medias?: string, initial_content?: string }>();
  const postId = params.post_id;

  const { data: post } = useQuery({
    queryKey: ['posts', postId],
    queryFn: () => getPostById(postId)
  })

  const initialMedias = params.initial_medias ?? post?.medias;
  const initialContent = params.initial_content ?? post?.content;

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => router.replace('/draft')}>
          <AntDesign name="inbox" size={24} color="white" />
        </Pressable>
      ),
    })
  }, [navigation])

  const { editPost, isEditing } = usePostActions(post!);

  const handleSubmit = async (content: string, mediaUrls?: string[]) => {
    editPost({ content, mediaUrls });
  };

  return (
    <PostForm
      isEdit={true}
      parentId={post?.parent_id}
      postId={postId}
      initialContent={initialContent}
      initialMedias={initialMedias}
      postType={post?.post_type}
      isSubmitting={isEditing}
      submitButtonText="更新"
      onSubmit={handleSubmit}
    />
  );
} 
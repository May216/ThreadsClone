import { useEffect } from "react";
import { Pressable } from "react-native";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

import { PostForm } from "@/components/post/PostForm";
import { useCreatePost } from "@/hooks";
import { PostType } from "@/types/post";

type NewPostParams = {
  parent_id: string;
  post_type: PostType;
  initial_medias: string[];
  initial_content: string;
}

export default function NewPostScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams<NewPostParams>();
  const parentId = params.parent_id;
  const postType = params.post_type;
  const initialContent = params.initial_content;
  const initialMedias = params.initial_medias;

  const { createPost, isCreating } = useCreatePost();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => router.replace('/draft')}>
          <AntDesign name="inbox" size={24} color="white" />
        </Pressable>
      ),
    })
  }, [navigation])

  const handleSubmit = async (content: string, mediaUrls?: string[]) => {
    createPost({
      content,
      postType: postType as PostType,
      parentId,
      mediaUrls
    });
  };

  return (
    <PostForm
      isEdit={false}
      parentId={parentId}
      isSubmitting={isCreating}
      initialContent={initialContent}
      initialMedias={initialMedias}
      postType={postType}
      submitButtonText="發佈"
      onSubmit={handleSubmit}
    />
  );
}
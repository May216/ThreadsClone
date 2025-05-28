import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

import { PostForm } from "@/components/post";
import { usePostActions } from "@/hooks";
import { getPostById } from "@/services/posts";

export default function EditPostScreen() {
  const params = useLocalSearchParams<{ post_id: string }>();
  const postId = params.post_id;

  const { data: post } = useQuery({
    queryKey: ['posts', postId],
    queryFn: () => getPostById(postId)
  })

  const { editPost, isEditing } = usePostActions(post!);

  const handleSubmit = async (content: string, mediaUrls?: string[]) => {
    editPost({ content, mediaUrls });
  };

  return (
    <PostForm
      isEdit={true}
      parentId={post?.parent_id}
      postId={postId}
      initialContent={post?.content}
      initialMedias={post?.medias}
      isSubmitting={isEditing}
      submitButtonText="更新"
      onSubmit={handleSubmit}
    />
  );
} 
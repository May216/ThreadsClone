import { useLocalSearchParams } from "expo-router";
import { PostForm } from "@/components/post/PostForm";
import { useCreatePost } from "@/hooks";

export default function NewPostScreen() {
  const params = useLocalSearchParams<{ parent_id: string, post_type: string }>();
  const parentId = params.parent_id;
  const postType = params.post_type;

  const { createPost, isCreating } = useCreatePost();

  const handleSubmit = async (content: string, mediaUrls?: string[]) => {
    createPost({
      content,
      postType: postType as 'post' | 'quote',
      parentId,
      mediaUrls
    });
  };

  return (
    <PostForm
      isEdit={false}
      parentId={parentId}
      postType={postType as 'post' | 'quote'}
      onSubmit={handleSubmit}
      isSubmitting={isCreating}
      submitButtonText="發佈"
    />
  );
}
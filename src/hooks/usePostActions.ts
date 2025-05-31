import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { deletePost, updatePost } from "@/services/posts";
import { PostWithUser } from "@/types/post";

export const usePostActions = (post: PostWithUser) => {
  const queryClient = useQueryClient();

  const { mutate: deletePostMutation, isPending: isDeleting } = useMutation({
    mutationFn: () => deletePost(post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  const { mutate: editPostMutation, isPending: isEditing } = useMutation({
    mutationFn: (updates: { content: string, mediaUrls?: string[] }) =>
      updatePost(post.id, {
        content: updates.content,
        medias: updates.mediaUrls
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      router.back();
    }
  });

  return {
    deletePost: deletePostMutation,
    editPost: editPostMutation,
    isDeleting,
    isEditing
  };
}; 
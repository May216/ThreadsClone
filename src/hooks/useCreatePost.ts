import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { createPost } from "@/services/posts";
import { useAuth } from "@/providers/AuthProvider";

interface CreatePostParams {
  content: string;
  postType: 'post' | 'quote' | 'reply';
  parentId?: string;
  mediaUrls?: string[];
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({ content, postType, parentId, mediaUrls }: CreatePostParams) => {
      if (postType === 'quote' || postType === 'reply') {
        return createPost({
          post_type: postType,
          content,
          user_id: user!.id,
          parent_id: parentId,
          medias: mediaUrls?.length ? mediaUrls : undefined
        });
      } else {
        return createPost({
          post_type: 'post',
          content,
          user_id: user!.id,
          medias: mediaUrls?.length ? mediaUrls : undefined
        });
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      if (variables.parentId) {
        queryClient.invalidateQueries({ queryKey: ['reposts', variables.parentId] });
      }
      router.back();
    },
    onError: (error) => {
      console.error(error);
    }
  });

  return {
    createPost: mutate,
    isCreating: isPending,
    error
  };
}; 
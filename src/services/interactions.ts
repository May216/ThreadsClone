import { supabase } from '@/lib/supabase';

export const toggleLike = async (postId: string, userId: string) => {
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (existingLike) {
    const { data } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)
      .throwOnError();
    return { action: 'unlike', data };
  } else {
    const { data } = await supabase
      .from('likes')
      .insert({ post_id: postId, user_id: userId })
      .throwOnError();
    return { action: 'like', data };
  }
}

export const getPostLikes = async (postId: string) => {
  const { data } = await supabase
    .from('likes')
    .select('*, user:profiles(*)')
    .eq('post_id', postId)
    .throwOnError();
  return data;
}

export const getUserLikeStatus = async (postId: string, userId: string) => {
  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();
  return !!data;
}
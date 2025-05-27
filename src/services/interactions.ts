import { supabase } from '@/lib/supabase'

export const toggleLike = async (postId: string, userId: string) => {
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single()

  if (existingLike) {
    const { data } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)
      .throwOnError()
    return { action: 'unlike', data }
  } else {
    const { data } = await supabase
      .from('likes')
      .insert({ post_id: postId, user_id: userId })
      .throwOnError()
    return { action: 'like', data }
  }
}

export const getPostLikes = async (postId: string) => {
  const { data } = await supabase
    .from('likes')
    .select('*, user:profiles(*)')
    .eq('post_id', postId)
    .throwOnError()
  return data
}

export const getUserLikeStatus = async (postId: string, userId: string) => {
  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single()
  return !!data
}

export const toggleRepost = async (postId: string, userId: string) => {
  const { data: existingRepost } = await supabase
    .from('reposts')
    .select('id')
    .or(`id.eq.${postId},user_id.eq.${userId}`)
    .single()

  if (existingRepost) {
    const { data } = await supabase
      .from('reposts')
      .delete()
      .eq('id', existingRepost.id)
      .throwOnError()
    return { action: 'removeRepost', data }
  } else {
    const { data } = await supabase
      .from('reposts')
      .insert({
        post_id: postId,
        user_id: userId
      })
      .throwOnError()
    return { action: 'repost', data }
  }
}

export const getPostRepostsCount = async (postId: string) => {
  const { data: reposts } = await supabase
    .from('reposts')
    .select('*')
    .eq('post_id', postId)
    .throwOnError()
  const { data: quotes } = await supabase
    .from('posts')
    .select('*')
    .eq('post_type', 'quote')
    .eq('parent_id', postId)
    .throwOnError()
  return reposts.length + quotes.length
}

export const getUserRepostsStatus = async (postId: string, userId: string) => {
  const { data } = await supabase
    .from('reposts')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single()
  return !!data
}
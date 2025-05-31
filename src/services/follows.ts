import { supabase } from "@/lib/supabase";

export const getUserFollowers = async (userId: string) => {
  try {
    const { data } = await supabase
      .from('follows')
      .select('*, profiles!follows_follower_id_fkey1(*)')
      .eq('following_id', userId)
      .throwOnError();

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export const getUserFollowing = async (userId: string) => {
  try {
    const { data } = await supabase
      .from('follows')
      .select('*, profiles!follows_following_id_fkey1(*)')
      .eq('follower_id', userId)
      .throwOnError();

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * 追蹤用戶
 * @param followerId 追蹤者ID
 * @param followingId 被追蹤者ID
 * @returns 
 */
export const followUser = async (followerId: string, followingId: string) => {
  const { data } = await supabase
    .from('follows')
    .insert({ follower_id: followerId, following_id: followingId })
    .throwOnError();
  return data;
}

/**
 * 取消追蹤用戶
 * @param followerId 追蹤者ID
 * @param followingId 被追蹤者ID
 * @returns 
 */
export const unfollowUser = async (followerId: string, followingId: string) => {
  const { data } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .throwOnError();

  return data;
}

export const getUserFollowersCount = async (userId: string) => {
  const { data } = await supabase
    .from('follows')
    .select('*')
    .eq('following_id', userId)
    .throwOnError();

  return data?.length || 0;
}

export const getUserFollowingCount = async (userId: string) => {
  const { data } = await supabase
    .from('follows')
    .select('*')
    .eq('follower_id', userId)
    .throwOnError();

  return data?.length || 0;
}

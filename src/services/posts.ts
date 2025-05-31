import { supabase } from "@/lib/supabase";
import { TablesInsert } from "@/types/database.types";
import { PostInput, PostWithUser } from "@/types/post";

const getPostsWithParentData = async (posts: TablesInsert<'posts'>[]) => {
  const postsWithParent = posts?.filter(post => post.parent_id) || [];
  const parentIds = [...new Set(postsWithParent.map(post => post.parent_id))];

  const { data: parentPosts } = await supabase
    .from('posts')
    .select('*, user: profiles(*), replies:posts(count)')
    .in('id', parentIds)
    .throwOnError();

  const parentPostsMap = parentPosts?.reduce((acc, post) => {
    acc[post.id] = post;
    return acc;
  }, {} as Record<string, any>) || {};

  const postsWithParentData = posts?.map(post => {
    if (post.parent_id) {
      return {
        ...post,
        parent: parentPostsMap[post.parent_id]
      };
    }
    return post;
  });

  return postsWithParentData;
}

export const fetchPosts = async ({ pageParam = 1 }) => {
  const { data: posts } = await supabase
    .from('posts')
    .select('*, user: profiles(*), replies:posts(count)')
    .order('created_at', { ascending: false })
    .range((pageParam - 1) * 5, pageParam * 5 - 1)
    .throwOnError();

  const postsWithParentData = await getPostsWithParentData(posts);

  return postsWithParentData;
}

export const createPost = async (newPost: PostInput) => {
  const { data } = await supabase
    .from('posts')
    .insert(newPost)
    .select()
    .throwOnError();

  return data;
}

export const deletePost = async (postId: string) => {
  const { data } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .throwOnError();

  return data;
}

export const getPostById = async (id: string) => {
  const { data } = await supabase
    .from('posts')
    .select('*, user:profiles(*), replies:posts(count)')
    .eq('id', id)
    .single()
    .throwOnError();

  return data;
}

export const getPostsByUserId = async (id: string): Promise<PostWithUser[]> => {
  const { data } = await supabase
    .from('posts')
    .select('*, user:profiles(*), replies:posts(count)')
    .eq('user_id', id)
    .order('created_at', { ascending: false })
    .throwOnError();

  const postsWithParentData = await getPostsWithParentData(data);

  return postsWithParentData as PostWithUser[];
}

export const getPostReplies = async (id: string) => {
  const { data } = await supabase
    .from('posts')
    .select('*, user:profiles(*), replies:posts(count)')
    .eq('parent_id', id)
    .eq('post_type', 'reply')
    .throwOnError();

  return data;
}

export const updatePost = async (postId: string, updates: Partial<PostInput>) => {
  const { data } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .select()
    .throwOnError();

  return data;
}

export const getUserReposts = async (userId: string): Promise<PostWithUser[]> => {
  const { data: reposts } = await supabase
    .from('reposts')
    .select('post_id')
    .eq('user_id', userId)
    .throwOnError();

  const { data: posts } = await supabase
    .from('posts')
    .select('*, user: profiles(*), replies:posts(count)')
    .in('id', reposts?.map(repost => repost.post_id) || [])
    .order('created_at', { ascending: false })
    .throwOnError();

  return posts as PostWithUser[];
}
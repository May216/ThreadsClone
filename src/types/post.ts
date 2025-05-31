import { ImagePickerAsset } from 'expo-image-picker';
import { Tables, TablesInsert } from './database.types';

export type PostType = 'post' | 'quote' | 'reply';

export interface Draft {
  id: string;
  content: string;
  medias: ImagePickerAsset[];
  post_type: PostType;
  parentId?: string;
  postId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PostInput = TablesInsert<'posts'>

export type PostWithUser = Tables<'posts'> & {
  user: Tables<'profiles'>
  replies: {
    count: number
  }[]
  parent?: PostWithUser
}
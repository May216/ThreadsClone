import { ImagePickerAsset } from 'expo-image-picker';

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
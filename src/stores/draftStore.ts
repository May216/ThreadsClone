import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImagePickerAsset } from 'expo-image-picker';
import { PostType } from '@/types/post';

interface Draft {
  id: string;
  content: string;
  medias: ImagePickerAsset[];
  post_type: PostType;
  parentId?: string;
  postId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DraftStore {
  drafts: Draft[];
  addDraft: (params: {
    content: string;
    medias: ImagePickerAsset[];
    post_type: PostType;
    parentId?: string;
    postId?: string;
  }) => void;
  updateDraft: (params: {
    id: string;
    content: string;
    medias: ImagePickerAsset[];
    post_type: PostType;
    parentId?: string;
    postId?: string;
  }) => void;
  deleteDraft: (id: string) => void;
  getDraft: (id: string) => Draft | undefined;
}

export const useDraftStore = create<DraftStore>()(
  persist(
    (set, get) => ({
      drafts: [],
      addDraft: (params) => {
        const { content, medias, post_type, parentId, postId } = params;
        const newDraft: Draft = {
          id: Date.now().toString(),
          content,
          medias,
          post_type,
          parentId,
          postId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          drafts: [newDraft, ...state.drafts],
        }));
      },
      updateDraft: (params) => {
        const { id, content, medias, post_type, parentId, postId } = params;
        set((state) => ({
          drafts: state.drafts.map((draft) =>
            draft.id === id
              ? {
                  ...draft,
                  content,
                  medias,
                  post_type,
                  parentId,
                  postId,
                  updatedAt: new Date(),
                }
              : draft
          ),
        }));
      },
      deleteDraft: (id) => {
        set((state) => ({
          drafts: state.drafts.filter((draft) => draft.id !== id),
        }));
      },
      getDraft: (id) => {
        return get().drafts.find((draft) => draft.id === id);
      },
    }),
    {
      name: 'draft-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
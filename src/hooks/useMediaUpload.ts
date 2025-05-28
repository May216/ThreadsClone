import { useState } from 'react';
import { ImagePickerAsset, launchImageLibraryAsync } from 'expo-image-picker';
import { supabase } from '@/lib/supabase';

export const useMediaUpload = () => {
  const [medias, setMedias] = useState<ImagePickerAsset[]>([]);
  const [deletedMedias, setDeletedMedias] = useState<string[]>([]);

  const pickMedia = async () => {
    let result = await launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 20,
      orderedSelection: true
    });

    if (!result.canceled) {
      setMedias(prevMedias => [...prevMedias, ...result.assets]);
    }
  };

  const removeMedia = (index: number) => {
    const media = medias[index];
    if (media.uri.includes(process.env.EXPO_PUBLIC_SUPABASE_URL!)) {
      const filename = media.uri.split('/').pop()!;
      setDeletedMedias(prev => [...prev, filename]);
    }
    setMedias(medias.filter((_, i) => i !== index));
  };

  const uploadMedia = async (media: ImagePickerAsset) => {
    if (!media) return;
    const arraybuffer = await fetch(media.uri).then(res => res.arrayBuffer());
    const fileExt = media.uri?.split('.').pop()?.toLowerCase();
    const path = `${Date.now()}.${fileExt}`;
    const { data, error: uploadError } = await supabase.storage
      .from('media')
      .upload(path, arraybuffer, {
        contentType: media.mimeType
      });
    if (uploadError) {
      throw uploadError;
    }
    return data.path;
  };

  const uploadAllMedia = async () => {
    if (medias.length === 0) return [];
    const mediaPromises = medias.map(async (media) => {
      if (media.uri.includes(process.env.EXPO_PUBLIC_SUPABASE_URL!)) {
        return media.uri.split('/').pop()!;
      }
      return await uploadMedia(media);
    });
    const results = await Promise.all(mediaPromises);
    return results.filter((url): url is string => url !== undefined);
  };

  const deleteRemovedMedias = async () => {
    if (deletedMedias.length === 0) return;
    const { error } = await supabase.storage
      .from('media')
      .remove(deletedMedias);
    if (error) {
      console.error('Error deleting media:', error);
    }
    setDeletedMedias([]);
  };

  return {
    medias,
    pickMedia,
    removeMedia,
    uploadAllMedia,
    deleteRemovedMedias,
    setMedias
  };
}; 
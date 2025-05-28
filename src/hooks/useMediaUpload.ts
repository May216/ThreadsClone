import { useState } from 'react';
import { ImagePickerAsset, launchImageLibraryAsync } from 'expo-image-picker';
import { supabase } from '@/lib/supabase';

export const useMediaUpload = () => {
  const [medias, setMedias] = useState<ImagePickerAsset[]>([]);

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
    const mediaPromises = medias.map(uploadMedia);
    return await Promise.all(mediaPromises) as string[];
  };

  return {
    medias,
    pickMedia,
    removeMedia,
    uploadAllMedia,
    setMedias
  };
}; 
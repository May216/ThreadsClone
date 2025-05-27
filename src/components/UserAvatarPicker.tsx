import { useState } from "react";
import { Alert, Pressable } from "react-native";
import * as ImagePicker from 'expo-image-picker';

import { SupabaseImage } from "./SupabaseImage";
import { supabase } from "@/lib/supabase";

export const UserAvatarPicker = ({ currentAvatar, onUpload }: { currentAvatar: string, onUpload: (avatarUrl: string) => void }) => {
  const [uploading, setUploading] = useState(false);

  async function uploadAvatar() {
    try {
      setUploading(true)
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 1,
        exif: false,
      })
      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log('User cancelled image picker.')
        return
      }
      const image = result.assets[0]
      if (!image.uri) {
        throw new Error('No image uri!')
      }
      const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer())
      const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg'
      const path = `${Date.now()}.${fileExt}`
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? 'image/jpeg',
        })
      if (uploadError) {
        throw uploadError
      }
      onUpload(data.path)
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      } else {
        throw error
      }
    } finally {
      setUploading(false)
    }
  }


  return (
    <Pressable className="self-center" disabled={uploading} onPress={uploadAvatar}>
      <SupabaseImage
        bucket="avatars"
        path={currentAvatar}
        className="w-24 h-24 rounded-full"
        transform={{ width: 96, height: 96 }}
      />
    </Pressable>
  )
}
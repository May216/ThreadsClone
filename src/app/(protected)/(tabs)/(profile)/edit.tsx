import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

import { getProfileById, updateProfile } from "@/services/profiles";
import { useAuth } from "@/providers/AuthProvider";

export default function ProfileEditScreen() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => getProfileById(user?.id!),
    enabled: !!user?.id,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: () => updateProfile(user?.id!, { full_name: fullName, bio }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] })
      router.back()
    }
  })

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setBio(profile.bio);
    }
  }, [profile?.id])

  return (
    <View className="flex-1 p-4 gap-4">
      <Text className="text-white text-2xl font-bold">編輯個人檔案</Text>
      <TextInput
        className="text-white border-2 border-neutral-700 rounded-md p-4"
        placeholder="全名"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        placeholder="簡介"
        placeholderTextColor="gray"
        className="text-white border-2 border-neutral-700 rounded-md p-4"
        multiline
        numberOfLines={5}
        value={bio}
        onChangeText={setBio}
      />
      <View className="mt-auto">
        <Pressable
          className={`${isPending ? 'bg-white/50' : 'bg-white'} rounded-full p-4 items-center`}
          disabled={isPending}
          onPress={() => mutate()}
        >
          <Text className="text-black font-bold">儲存</Text>
        </Pressable>
      </View>
    </View>
  )
}
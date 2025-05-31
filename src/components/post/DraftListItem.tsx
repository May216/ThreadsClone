import { View, Text, Pressable } from "react-native"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import { SimpleMenu } from "../common"
import { SupabaseImage } from "../media"
import { PostMediaWithLocal } from "./PostMediaWithLocal"
import { useAuth } from "@/providers/AuthProvider"
import { Draft } from "@/types/post"

dayjs.extend(relativeTime)

interface DraftListItemProps {
  data: Draft
  onDelete: (id: string) => void
  onPress: (draft: Draft) => void
}

export const DraftListItem = ({ data, onDelete, onPress }: DraftListItemProps) => {
  const { profile } = useAuth()

  const contextMenuOptions = [
    {
      label: '刪除草稿',
      danger: true,
      onPress: () => onDelete(data.id),
    },
  ]

  return (
    <Pressable className="flex-row p-4" onPress={() => onPress(data)}>
      {/* avatar */}
      <View className='mr-3 items-center gap-2'>
        <SupabaseImage
          bucket="avatars"
          path={profile?.avatar_url!}
          className='w-12 h-12 rounded-full'
          transform={{ width: 48, height: 48 }}
        />
      </View>

      {/* content area */}
      <View className="flex-1 gap-2">
        {/* user info */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <Text className="text-white font-bold mr-2">{profile?.username}</Text>
            <Text className="text-gray-500">
              {dayjs(data.createdAt).fromNow()}
            </Text>
          </View>
          <SimpleMenu options={contextMenuOptions} />
        </View>

        {/* post content */}
        {data.content && <Text className="text-white">{data.content}</Text>}

        {/* medias */}
        {data.medias && <PostMediaWithLocal medias={data.medias} />}
      </View>
    </Pressable>
  )
}
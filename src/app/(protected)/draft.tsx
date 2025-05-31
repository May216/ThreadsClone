import React from "react";
import { FlatList, View } from "react-native";
import { router } from "expo-router";

import { useDraftStore } from "@/stores/draftStore";
import { DraftListItem } from "@/components";
import { Draft } from "@/types/post";

export default function DraftScreen() {
  const { drafts, deleteDraft } = useDraftStore();

  const handleDelete = (id: string) => {
    deleteDraft(id)
  }

  const handlePress = (draft: Draft) => {
    const params = {
      post_id: draft.postId,
      post_type: draft.post_type,
      parent_id: draft.parentId,
      initial_medias: JSON.stringify(draft.medias),
      initial_content: draft.content,
    }

    router.replace({
      pathname: !!draft.postId ? '/updatePost' : '/newPost',
      params
    })
  }

  return (
    <FlatList
      data={drafts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <React.Fragment key={item.id}>
          <DraftListItem data={item} onDelete={handleDelete} onPress={handlePress} />
          <View className="h-[1px] bg-neutral-800 my-2" />
        </React.Fragment>
      )}
    />
  )
}
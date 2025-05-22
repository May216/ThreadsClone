import { memo } from "react";
import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InteractionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  count?: number;
  accessibilityLabel: string;
  onPress: () => void;
}

export const InteractionButton = memo(({ 
  icon, 
  count, 
  onPress, 
  accessibilityLabel 
}: InteractionButtonProps) => (
  <Pressable 
    onPress={onPress}
    className="flex-row items-center"
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
  >
    <Ionicons name={icon} size={20} color="#d1d5db" />
    {!!count && count > 0 && (
      <Text className="text-gray-300 ml-2 text-sm">{count}</Text>
    )}
  </Pressable>
));

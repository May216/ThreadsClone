import { memo } from "react";
import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InteractionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  count?: number;
  accessibilityLabel: string;
  color?: string;
  onPress: () => void;
}

export const InteractionButton = memo(({ 
  icon, 
  count, 
  accessibilityLabel,
  color = "#d1d5db",
  onPress, 
}: InteractionButtonProps) => (
  <Pressable 
    onPress={onPress}
    className="flex-row items-center"
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
  >
    <Ionicons name={icon} size={20} color={color} />
    {!!count && count > 0 && (
      <Text className="text-gray-300 ml-2 text-sm">{count}</Text>
    )}
  </Pressable>
));

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
    <Text className="ml-2 text-sm w-6" style={{ color }}>
      {count && count > 0 ? count : ''}
    </Text>
  </Pressable>
));

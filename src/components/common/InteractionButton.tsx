import { memo } from "react";
import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const formatCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return count.toString();
};

interface InteractionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  count?: number;
  accessibilityLabel: string;
  color?: string;
  size?: number;
  onPress: () => void;
}

export const InteractionButton = memo(({
  icon,
  count,
  accessibilityLabel,
  color = "#d1d5db",
  size = 20,
  onPress,
}: InteractionButtonProps) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center"
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
  >
    <Ionicons name={icon} size={size} color={color} />
    <Text className="ml-2 text-sm w-6" style={{ color }}>
      {count && count > 0 ? formatCount(count) : ''}
    </Text>
  </Pressable>
));

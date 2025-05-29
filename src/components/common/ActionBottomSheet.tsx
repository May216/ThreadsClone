import React from 'react';
import { View, Text, Pressable } from 'react-native';

export type ActionSheetOption = {
  key: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
  danger?: boolean;
};

export type ActionBottomSheetProps = {
  options: ActionSheetOption[];
  onSelect?: (key: string) => void;
  onClose?: () => void;
};

export const ActionBottomSheet: React.FC<ActionBottomSheetProps> = ({ options, onSelect, onClose }) => {
  const handleSelect = (key: string) => {
    if (onSelect) onSelect(key);
    if (onClose) onClose();
  };

  return (
    <View className="mx-4 mb-8 bg-[#2F2F2F] rounded-2xl">
      {options.map((option, index) => (
        <Pressable
          key={option.key}
          className={`flex-row items-center px-6 py-4 ${index !== options.length - 1 ? 'border-b border-[#404141]' : ''}`}
          android_ripple={{ color: '#222' }}
          onPress={() => handleSelect(option.key)}
        >
          <Text
            className={`flex-1 text-[17px] font-normal tracking-[0.5px] ${option.danger ? 'text-[#F44] font-medium' : 'text-white'}`}
            style={option.color ? { color: option.color } : undefined}
          >
            {option.label}
          </Text>
          <View className="w-7 items-center mr-4">{option.icon}</View>
        </Pressable>
      ))}
    </View>
  );
};
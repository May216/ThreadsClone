import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import FeatherIcon from '@expo/vector-icons/Feather';

interface SimpleMenuProps {
  options: {
    label: string;
    danger?: boolean;
    onPress: () => void;
  }[];
}

export const SimpleMenu = ({ options }: SimpleMenuProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <View className="relative">
      {/* trigger */}
      <Pressable onPress={() => setVisible(true)}>
        <FeatherIcon name="more-horizontal" size={16} color="gray" />
      </Pressable>

      {/* menu */}
      {visible && (
        <>
          <Pressable
            className="absolute left-0 top-0 right-0 bottom-0 z-40"
            onPress={() => setVisible(false)}
          />
          <View className="absolute right-0 top-6 bg-neutral-900 p-3 rounded-lg shadow-lg z-50 w-24">
            {options.map((option) => (
              <Pressable
                key={option.label}
                onPress={() => {
                  setVisible(false);
                  option.onPress();
                }}
              >
                <Text className={`font-bold ${option.danger ? 'text-red-500' : 'text-white'}`}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </>
      )}
    </View>
  );
} 
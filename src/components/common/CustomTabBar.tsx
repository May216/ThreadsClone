import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const ICONS = [
  { name: 'home', route: '(home)' },
  { name: 'search', route: 'search' },
  { name: 'plus', route: 'plus' },
  { name: 'heart', route: 'notifications' },
  { name: 'user', route: '(profile)' },
];

export const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  return (
    <View className="rounded-t-[20px] mx-0 mb-0 pb-6">
      <View className="flex-row justify-between items-center rounded-t-[20px] px-6 py-2">
        {ICONS.map((icon, idx) => {
          const isFocused = state.index === idx;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: state.routes[idx].key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(icon.route);
            }
          };
          if (icon.name === 'plus') {
            return (
              <TouchableOpacity
                key={icon.name}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                className="w-14 h-12 rounded-xl bg-[#1C1C1C] items-center justify-center mx-3"
                activeOpacity={0.8}
                onPress={onPress}
              >
                <Feather name="plus" size={28} color="white" />
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              key={icon.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              className="flex-1 items-center justify-center h-12"
              activeOpacity={0.7}
              onPress={onPress}
            >
              <Feather
                name={icon.name as any}
                size={24}
                color={isFocused ? '#fff' : '#888'}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
} 
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const ICONS = [
  { name: 'home', route: 'index' },
  { name: 'search', route: 'search' },
  { name: 'plus', route: 'plus' },
  { name: 'heart', route: 'notifications' },
  { name: 'user', route: 'profile' },
];

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
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
                onPress={onPress}
                style={styles.plusButton}
                activeOpacity={0.8}
              >
                <Feather name="plus" size={28} color="#fff" />
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              key={icon.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
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

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: '#111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginHorizontal: 0,
    marginBottom: 0,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  plusButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
}); 
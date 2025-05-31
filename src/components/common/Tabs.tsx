import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Animated, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

interface Tab {
  label: string
  key: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
}

export const Tabs = ({ tabs }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    Animated.spring(translateX, {
      toValue: (screenWidth / tabs.length) * index,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View>
      {/* Tabs */}
      <View className="flex-row relative">
        {tabs.map((tab, idx) => (
          <TouchableOpacity
            key={tab.key}
            className="flex-1 items-center py-4"
            onPress={() => handleTabPress(idx)}
            activeOpacity={0.7}
          >
            <Text className={`text-base font-bold ${activeTab === idx ? "text-white" : "text-gray-400"}`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
        {/* Animated underline */}
        <Animated.View
          className="absolute h-0.5 bg-white bottom-0 left-0"
          style={{
            width: screenWidth / tabs.length,
            transform: [{ translateX }],
          }}
        />
      </View>
      {/* Tab Content */}
      {tabs[activeTab].content}
    </View>
  );
};
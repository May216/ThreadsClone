import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { SupabaseImage } from '../media';

interface ConfirmModalProps {
  isVisible: boolean;
  title?: string;
  avatar?: string;
  message: string;
  options: {
    text: string;
    textClassName?: string;
    onPress: () => void;
  }[];
  onBackdropPress: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isVisible,
  title,
  avatar,
  message,
  options,
  onBackdropPress,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      animationIn="fadeIn"
      animationOut="fadeOut"
      className="justify-center items-center"
      onBackdropPress={onBackdropPress}
    >
      <View className="bg-[#222222] rounded-2xl w-3/4 px-0 pt-6 pb-4 items-center">
        {title && (
          <Text className="text-white text-2xl font-extrabold mb-2 text-center">
            {title}
          </Text>
        )}
        {avatar && (
          <View className="mb-4 bg-neutral-600/50 rounded-full">
            <SupabaseImage
              bucket="avatars"
              path={avatar}
              className="w-16 h-16 rounded-full"
              transform={{ width: 80, height: 80 }}
            />
          </View>
        )}
        <Text className="text-gray-400 px-8 mb-6 text-center text-base leading-relaxed">{message}</Text>
        {options.map((option) => (
          <React.Fragment key={option.text}>
            <View className="h-px w-full bg-neutral-700" />
            <Pressable className="py-3 w-full" android_ripple={{ color: '#222' }} onPress={option.onPress}>
              <Text className={`text-center text-xl ${option.textClassName ? option.textClassName : 'text-white'}`}>
                {option.text}
              </Text>
            </Pressable>
          </React.Fragment>
        ))}
      </View>
    </Modal>
  );
}; 
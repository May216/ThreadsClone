import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Modal from 'react-native-modal';

interface ConfirmModalProps {
  isVisible: boolean;
  title: string;
  message: string;
  saveText?: string;
  discardText?: string;
  continueText?: string;
  onSave: () => void;
  onDiscard: () => void;
  onContinue: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isVisible,
  title,
  message,
  saveText = '儲存',
  discardText = '不儲存',
  continueText = '繼續編輯',
  onSave,
  onDiscard,
  onContinue,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      animationIn="fadeIn"
      animationOut="fadeOut"
      className="justify-center items-center"
      onBackdropPress={onContinue}
    >
      <View className="bg-[#222222] rounded-2xl w-3/4 px-0 pt-6 pb-4 items-center">
        <Text className="text-white text-2xl font-extrabold mb-2 text-center">{title}</Text>
        <Text className="text-gray-400 px-8 mb-6 text-center text-base leading-relaxed">{message}</Text>
        <View className="h-px w-full bg-neutral-700" />
        <Pressable className="py-3 w-full" onPress={onSave} android_ripple={{ color: '#222' }}>
          <Text className="text-blue-500 text-center text-xl font-bold">{saveText}</Text>
        </Pressable>
        <View className="h-px w-full bg-neutral-700" />
        <Pressable className="py-3 w-full" onPress={onDiscard} android_ripple={{ color: '#222' }}>
          <Text className="text-red-500 text-center text-lg">{discardText}</Text>
        </Pressable>
        <View className="h-px w-full bg-neutral-700" />
        <Pressable className="pt-3 w-full" onPress={onContinue} android_ripple={{ color: '#222' }}>
          <Text className="text-white text-center text-xl">{continueText}</Text>
        </Pressable>
      </View>
    </Modal>
  );
}; 
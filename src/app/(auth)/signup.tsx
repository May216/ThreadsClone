import { View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) {
      // TODO: 添加錯誤提示
      return;
    }

    try {
      setIsLoading(true);
      // TODO: 實現註冊邏輯
      console.log('註冊信息:', { email, password });
    } catch (error) {
      console.error('註冊失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-neutral-900 p-6 justify-center">
      <View className="gap-6">
        <View>
          <Text className="text-3xl font-bold text-white mb-2">註冊</Text>
          <Text className="text-gray-400">請註冊您的帳號</Text>
        </View>

        <View className="gap-4">
          <View>
            <Text className="text-gray-300 mb-2">電子郵件</Text>
            <TextInput
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500"
              placeholder="請輸入電子郵件"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
            />
          </View>

          <View>
            <Text className="text-gray-300 mb-2">密碼</Text>
            <TextInput
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500"
              placeholder="請輸入密碼"
              placeholderTextColor="#6B7280"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity 
            className="w-full py-3 rounded-lg bg-white"
            onPress={handleSignup}
            disabled={isLoading}
          >
            <Text className="text-black text-center font-semibold text-lg">
              {isLoading ? '註冊中...' : '註冊'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-400">已經有帳號？</Text>
            <Link href="/login" asChild>
              <Pressable disabled={isLoading}>
                <Text className="text-blue-400 font-semibold ml-1">立即登錄</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}

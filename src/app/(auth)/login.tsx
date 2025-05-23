import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    if (!email || !password) {
      Alert.alert('請輸入電子郵件和密碼');
      setIsLoading(false);
      return;
    }
    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        Alert.alert(error.message);
      }
    } catch (error: any) {
      console.error('登錄失敗:', error);
      Alert.alert('登錄失敗:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-neutral-900 p-6 justify-center">
      <View className="gap-6">
        <View>
          <Text className="text-3xl font-bold text-white mb-2">歡迎回來</Text>
          <Text className="text-gray-400">請登錄您的帳號</Text>
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
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text className="text-black text-center font-semibold text-lg">
              {isLoading ? '登錄中...' : '登錄'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-400">還沒有帳號？</Text>
            <Link href="/signup" asChild>
              <Pressable disabled={isLoading}>
                <Text className="text-blue-400 font-semibold ml-1">立即註冊</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}

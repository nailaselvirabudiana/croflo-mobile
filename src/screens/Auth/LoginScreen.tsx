import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Lock, Mail } from 'lucide-react-native';
import { loginUser } from '../../services/auth';

export const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    
    setLoading(true);
    const { error } = await loginUser(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Login Failed', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="px-6">
          <View className="mb-10 items-center">
            <Text className="text-4xl font-extrabold text-primary mb-2">Croflo</Text>
            <Text className="text-gray-500 text-center">Understand density, navigate the crowd.</Text>
          </View>

          <View className="mb-8">
            <Text className="text-3xl font-bold text-primary mb-2">Welcome Back</Text>
            <Text className="text-gray-500 mb-6">Sign in to continue</Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Email Address</Text>
              <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                <Mail color="#9CA3AF" size={20} className="mr-3" />
                <TextInput
                  className="flex-1 text-primary text-base"
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View className="mb-2">
              <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
              <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                <Lock color="#9CA3AF" size={20} className="mr-3" />
                <TextInput
                  className="flex-1 text-primary text-base"
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            <TouchableOpacity className="items-end mb-6">
              <Text className="text-accent font-medium">Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-primary rounded-2xl py-4 items-center shadow-md shadow-primary/30"
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-lg font-bold">Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-auto mb-10">
            <Text className="text-gray-500">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-accent font-bold">Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

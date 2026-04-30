import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Lock, Mail, User } from 'lucide-react-native';
import { registerUser } from '../../services/auth';

export const RegisterScreen = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error } = await registerUser(email, password, name);
    setLoading(false);

    if (error) {
      Alert.alert('Registration Failed', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="px-6 py-6">
          <View className="mb-6">
            <Text className="text-3xl font-bold text-primary mb-2">Create Account</Text>
            <Text className="text-gray-500 mb-6">Join Croflo today!</Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Full Name</Text>
              <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                <User color="#9CA3AF" size={20} className="mr-3" />
                <TextInput
                  className="flex-1 text-primary text-base"
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

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

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
              <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                <Lock color="#9CA3AF" size={20} className="mr-3" />
                <TextInput
                  className="flex-1 text-primary text-base"
                  placeholder="Create a password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            <View className="mb-8">
              <Text className="text-sm font-medium text-gray-700 mb-2">Confirm Password</Text>
              <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                <Lock color="#9CA3AF" size={20} className="mr-3" />
                <TextInput
                  className="flex-1 text-primary text-base"
                  placeholder="Confirm your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            </View>

            <TouchableOpacity 
              className="bg-primary rounded-2xl py-4 items-center shadow-md shadow-primary/30"
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-lg font-bold">Sign Up</Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-auto mb-10">
            <Text className="text-gray-500">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text className="text-accent font-bold">Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

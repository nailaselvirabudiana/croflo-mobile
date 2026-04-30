import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Edit2, Users, Settings as SettingsIcon, Bell, Shield, LogOut, ChevronRight } from 'lucide-react-native';
import { MOCK_USER, RECENT_ACTIVITY } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { logoutUser } from '../../services/auth';

export const ProfileScreen = () => {
  const { user } = useAuth();
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1 px-5 pt-4 pb-24" showsVerticalScrollIndicator={false}>
        
        {/* Header Avatar */}
        <View className="items-center mb-8 mt-4">
          <View className="relative">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop' }} 
              className="w-28 h-28 rounded-full border-4 border-white shadow-sm bg-gray-200"
            />
            <TouchableOpacity className="absolute bottom-0 right-0 bg-primary w-8 h-8 rounded-full items-center justify-center border-2 border-white">
              <Edit2 color="#FFFFFF" size={14} />
            </TouchableOpacity>
          </View>
          <Text className="text-primary text-2xl font-extrabold mt-4">{user?.displayName || MOCK_USER.fullName}</Text>
          <Text className="text-gray-500">{user?.email || MOCK_USER.email}</Text>
        </View>

        {/* Stats */}
        <View className="flex-row justify-between mb-8">
          <View className="bg-white flex-1 rounded-3xl items-center py-6 shadow-sm border border-gray-50 mr-4">
            <Text className="text-primary text-3xl font-extrabold mb-1">{MOCK_USER.visits}</Text>
            <Text className="text-gray-500 text-xs font-bold tracking-wider uppercase">Visits</Text>
          </View>
          <View className="bg-white flex-1 rounded-3xl items-center py-6 shadow-sm border border-gray-50">
            <Text className="text-primary text-3xl font-extrabold mb-1">{MOCK_USER.savedPlaces}</Text>
            <Text className="text-gray-500 text-xs font-bold tracking-wider uppercase">Saved Places</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-primary text-lg font-bold">Recent Activity</Text>
            <TouchableOpacity>
              <Text className="text-accent font-bold text-sm">View All</Text>
            </TouchableOpacity>
          </View>
          
          {RECENT_ACTIVITY.map((activity) => (
            <View key={activity.id} className="bg-white rounded-3xl p-4 flex-row items-center mb-3 shadow-sm border border-gray-50">
              <Image source={{ uri: activity.imageUrl }} className="w-12 h-12 rounded-full mr-4 bg-gray-200" />
              <View className="flex-1">
                <Text className="text-primary font-bold text-base">{activity.name}</Text>
                <Text className="text-gray-500 text-xs">{activity.time}</Text>
              </View>
              <View className={`px-3 py-1 rounded-full flex-row items-center ${activity.status === 'Low' ? 'bg-green-50' : 'bg-orange-50'}`}>
                <Users size={12} color={activity.status === 'Low' ? '#16A34A' : '#D97706'} />
                <Text className={`text-xs font-bold ml-1 ${activity.status === 'Low' ? 'text-green-600' : 'text-orange-600'}`}>{activity.status}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Settings */}
        <View className="mb-8">
          <Text className="text-primary text-lg font-bold mb-4">Settings</Text>
          <View className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
            <TouchableOpacity className="flex-row items-center justify-between p-5 border-b border-gray-50">
               <View className="flex-row items-center">
                 <SettingsIcon color="#64748B" size={18} />
                 <Text className="text-primary font-bold ml-3">Account Settings</Text>
               </View>
               <ChevronRight color="#CBD5E1" size={20} />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between p-5 border-b border-gray-50">
               <View className="flex-row items-center">
                 <Bell color="#64748B" size={18} />
                 <Text className="text-primary font-bold ml-3">Notifications</Text>
               </View>
               <ChevronRight color="#CBD5E1" size={20} />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between p-5">
               <View className="flex-row items-center">
                 <Shield color="#64748B" size={18} />
                 <Text className="text-primary font-bold ml-3">Privacy</Text>
               </View>
               <ChevronRight color="#CBD5E1" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity 
          className="border border-red-100 bg-red-50/30 rounded-3xl py-4 items-center flex-row justify-center mb-8"
          onPress={async () => {
            await logoutUser();
          }}
        >
          <LogOut color="#DC2626" size={18} />
          <Text className="text-red-600 font-bold ml-2">Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

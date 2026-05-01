import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin } from 'lucide-react-native';
import { FlashList } from '@shopify/flash-list';
import { MOCK_USER } from '../../data/mockData';
import { CurrentSpotCard } from '../../components/CurrentSpotCard';
import { PlaceCard } from '../../components/PlaceCard';
import { subscribeToPlaces, Place } from '../../services/firestore';

export const HomeScreen = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const TypedFlashList = FlashList as any;

  useEffect(() => {
    const unsubscribe = subscribeToPlaces((data) => {
      setPlaces(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1 px-5 pt-4 pb-24" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <MapPin color="#64748B" size={16} />
            <Text className="text-gray-500 ml-1 font-medium">Dago, Bandung</Text>
          </View>
          <Text className="text-primary text-2xl font-extrabold">Good Morning, {MOCK_USER.name}</Text>
        </View>

        {/* Current Spot */}
        <CurrentSpotCard />

        {/* Recommended List */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-primary text-lg font-bold">Recommended for You</Text>
            <TouchableOpacity>
              <Text className="text-gray-600 font-medium text-sm">See all</Text>
            </TouchableOpacity>
          </View>
          <View className="h-40">
            {loading ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator color="#3AB4BA" />
              </View>
            ) : (
              <TypedFlashList
                data={places}
                renderItem={({ item }: any) => <PlaceCard item={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                estimatedItemSize={288}
                keyExtractor={(item: any) => item.id}
              />
            )}
          </View>
        </View>

        {/* Crowd Hotspots */}
        <View className="mb-8">
          <Text className="text-primary text-lg font-bold mb-4">Crowd Hotspots</Text>
          <View className="rounded-3xl overflow-hidden relative h-40">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop' }} 
              className="w-full h-full bg-gray-300"
            />
            <View className="absolute bottom-3 left-3 bg-white rounded-full px-3 py-1.5 flex-row items-center shadow-sm">
              <View className="w-2 h-2 rounded-full bg-busy mr-2" />
              <Text className="text-primary text-xs font-bold">High density area nearby</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

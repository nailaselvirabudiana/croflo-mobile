import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { CurrentSpotCard } from '../../components/CurrentSpotCard';
import { PlaceCard } from '../../components/PlaceCard';
import { subscribeToPlaces, Place } from '../../services/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentLocation, calculateDistance } from '../../services/location';

export const HomeScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [currentSpot, setCurrentSpot] = useState<Place | null>(null);
  const [locationName, setLocationName] = useState('Detecting location...');

  // Derive greeting and name from Firebase auth user
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const displayName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

  useEffect(() => {
    let unsubscribePlaces: (() => void) | undefined;

    const setupData = async () => {
      try {
        // 1. Get current location
        const coords = await getCurrentLocation();
        
        // 2. Subscribe to places and find if we are at one
        unsubscribePlaces = subscribeToPlaces((allPlaces) => {
          setPlaces(allPlaces);
          
          // Find if user is within 0.05 km (50 meters) of any place
          const spot = allPlaces.find(p => {
            if (!p.latitude || !p.longitude) return false;
            const dist = calculateDistance(coords.latitude, coords.longitude, p.latitude, p.longitude);
            return dist <= 0.05; // 50 meters
          });

          setCurrentSpot(spot || null);
          
          // Update location name if we found a spot, otherwise use a default
          if (spot) {
            setLocationName(spot.name);
          } else {
            setLocationName('Bandung, Indonesia');
          }
          
          setLoading(false);
        });
      } catch (error) {
        console.error("Error setting up Home data:", error);
        setLoading(false);
        setLocationName('Bandung, Indonesia');
      }
    };

    setupData();

    return () => {
      if (unsubscribePlaces) unsubscribePlaces();
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1 px-5 pt-4 pb-24" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <MapPin color="#64748B" size={16} />
            <Text className="text-gray-500 ml-1 font-medium">{locationName}</Text>
          </View>
          <Text className="text-primary text-2xl font-extrabold">{getGreeting()}, {displayName}!</Text>
        </View>

        {/* Current Spot - Only display if user is at a location in the database */}
        {currentSpot && <CurrentSpotCard place={currentSpot} />}

        {/* Recommended List */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-primary text-lg font-bold">Recommended for You</Text>
            <TouchableOpacity onPress={() => setShowAll(!showAll)}>
              <Text className="text-accent font-medium text-sm">
                {showAll ? 'Show less' : 'See all'}
              </Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <View className="py-6 items-center">
              <ActivityIndicator color="#3AB4BA" />
            </View>
          ) : (
            (showAll ? places : places.slice(0, 2)).map((item) => (
              <PlaceCard key={item.id} item={item} vertical />
            ))
          )}
        </View>

        {/* Crowd Hotspots */}
        <View className="mb-8">
          <Text className="text-primary text-lg font-bold mb-4">Crowd Hotspots</Text>
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Map')}
            className="rounded-3xl overflow-hidden relative h-40"
          >
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop' }} 
              className="w-full h-full bg-gray-300"
            />
            <View className="absolute bottom-3 left-3 bg-white rounded-full px-3 py-1.5 flex-row items-center shadow-sm">
              <View className="w-2 h-2 rounded-full bg-busy mr-2" />
              <Text className="text-primary text-xs font-bold">High density area nearby</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

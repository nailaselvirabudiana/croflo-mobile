import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Coffee, Star, Briefcase, Utensils, GraduationCap } from 'lucide-react-native';
import { subscribeToPlaces, Place } from '../../services/firestore';
import { getCurrentLocation, calculateDistance, formatDistance } from '../../services/location';

type FilterType = 'all' | 'distance' | 'Cafe' | 'Workspace' | 'Restaurant' | 'Education';

export const SearchScreen = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupSearch = async () => {
      try {
        const coords = await getCurrentLocation();
        setUserLocation(coords);

        unsubscribe = subscribeToPlaces((allPlaces) => {
          // Calculate distance for each place
          const placesWithDistance = allPlaces.map(p => {
            if (p.latitude && p.longitude) {
              const dist = calculateDistance(coords.latitude, coords.longitude, p.latitude, p.longitude);
              return { ...p, distanceValue: dist, distance: formatDistance(dist) };
            }
            return { ...p, distanceValue: 999, distance: 'Unknown' };
          });

          // Sort by distance by default
          placesWithDistance.sort((a, b) => (a.distanceValue || 0) - (b.distanceValue || 0));
          
          setPlaces(placesWithDistance);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error setting up Search:", error);
        setLoading(false);
      }
    };

    setupSearch();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const filteredDestinations = places.filter((dest) => {
    const matchesSearch = 
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeFilter === 'distance') {
      return (dest as any).distanceValue <= 3;
    }

    if (activeFilter !== 'all') {
      return dest.category.toLowerCase().includes(activeFilter.toLowerCase());
    }

    return true;
  });

  const FilterChip = ({ type, label, icon: Icon }: { type: FilterType, label: string, icon: any }) => {
    const isActive = activeFilter === type;
    return (
      <TouchableOpacity 
        onPress={() => setActiveFilter(isActive ? 'all' : type)}
        className={`rounded-full px-4 py-2 flex-row items-center mr-3 ${isActive ? 'bg-primary' : 'bg-white border border-gray-200'}`}
      >
        <Icon color={isActive ? '#FFFFFF' : '#64748B'} size={14} />
        <Text className={`font-bold ml-2 ${isActive ? 'text-white' : 'text-gray-600'}`}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1 px-5 pt-4 pb-24" showsVerticalScrollIndicator={false}>

        {/* Search Bar */}
        <View className="bg-white rounded-full flex-row items-center px-4 py-3 shadow-sm border border-gray-100 mb-6">
          <Search color="#64748B" size={20} />
          <TextInput
            placeholder="Search places..."
            placeholderTextColor="#94A3B8"
            className="flex-1 ml-3 text-base"
            style={{ color: '#0A1D37' }}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Filters */}
        <View className="mb-8">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FilterChip type="distance" label="< 3 km" icon={MapPin} />
            <FilterChip type="Cafe" label="Cafe" icon={Coffee} />
            <FilterChip type="Workspace" label="Workspace" icon={Briefcase} />
            <FilterChip type="Restaurant" label="Restaurant" icon={Utensils} />
            <FilterChip type="Education" label="Education" icon={GraduationCap} />
          </ScrollView>
        </View>

        {/* Nearby Destinations */}
        <Text className="text-primary text-sm font-bold tracking-widest uppercase mb-4">
          Nearby Destinations
        </Text>

        {loading ? (
          <View className="py-10 items-center">
            <ActivityIndicator color="#3AB4BA" size="large" />
          </View>
        ) : filteredDestinations.length === 0 ? (
          <View className="items-center py-10">
            <Text className="text-gray-400 text-center">
              {searchQuery ? `No places found matching "${searchQuery}"` : "No places found for this filter"}
            </Text>
          </View>
        ) : (
          filteredDestinations.map((dest) => (
            <TouchableOpacity
              key={dest.id}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('PlaceDetail', { place: dest })}
              className="bg-white rounded-2xl p-3 mb-4 flex-row shadow-sm border border-gray-50"
            >
              <Image
                source={{ uri: dest.imageUrl || 'https://via.placeholder.com/150' }}
                className="w-24 h-24 rounded-xl bg-gray-200"
                resizeMode="cover"
              />
              <View className="flex-1 ml-4 justify-between py-1">
                {/* Top Row: name + badge */}
                <View>
                  <View className="flex-row justify-between items-start">
                    <Text className="text-primary font-bold text-base flex-1" numberOfLines={1}>
                      {dest.name}
                    </Text>
                    <View
                      className={`px-2 py-0.5 rounded-md ml-1 ${
                        (dest.occupancy || 0) < 40
                          ? 'bg-blue-50'
                          : (dest.occupancy || 0) < 75
                          ? 'bg-teal-50'
                          : 'bg-red-50'
                      }`}
                    >
                      <Text
                        className={`text-[10px] font-bold ${
                          (dest.occupancy || 0) < 40
                            ? 'text-accent'
                            : (dest.occupancy || 0) < 75
                            ? 'text-teal-600'
                            : 'text-busy'
                        }`}
                      >
                        {(dest.occupancy || 0) < 40 ? 'LOW' : (dest.occupancy || 0) < 75 ? 'MODERATE' : 'BUSY'}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center mt-1">
                    <MapPin color="#94A3B8" size={12} />
                    <Text className="text-gray-500 text-xs ml-1">
                      {dest.distance} • {dest.category}
                    </Text>
                  </View>
                </View>

                {/* Bottom Row: rating + view details */}
                <View className="flex-row justify-between items-center mt-2">
                  <View className="flex-row items-center">
                    <Star color="#FFB347" size={14} fill="#FFB347" />
                    <Text className="text-primary font-bold ml-1 text-sm">{dest.rating}</Text>
                  </View>
                  <Text className="text-accent text-xs font-bold uppercase tracking-wider">
                    View Details
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Map Promo Card */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('Map')}
          className="bg-primary rounded-3xl p-6 mt-4 shadow-lg overflow-hidden relative"
        >
          <View className="absolute right-[-40px] bottom-[-20px] opacity-20">
            <MapPin size={180} color="#FFFFFF" strokeWidth={1} />
          </View>
          <Text className="text-white text-2xl font-extrabold mb-2 leading-tight">
            {'Interactive\nFlow Map'}
          </Text>
          <Text className="text-gray-300 text-sm w-2/3 mb-6">
            Real-time density updates for Bandung metropolitan area.
          </Text>
          <View className="bg-white rounded-full px-5 py-3 self-start">
            <Text className="text-primary font-bold">Open Map View</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

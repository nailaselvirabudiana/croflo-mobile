import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Tent, Coffee, Star } from 'lucide-react-native';
import { NEARBY_DESTINATIONS } from '../../data/mockData';

export const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDestinations = NEARBY_DESTINATIONS.filter(
    (dest) =>
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <TouchableOpacity className="bg-primary rounded-full px-4 py-2 flex-row items-center mr-3">
              <MapPin color="#FFFFFF" size={14} />
              <Text className="text-white font-bold ml-2">{'< 3 km'}</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white border border-gray-200 rounded-full px-4 py-2 flex-row items-center mr-3">
              <Tent color="#64748B" size={14} />
              <Text className="text-gray-600 font-bold ml-2">Attractions</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white border border-gray-200 rounded-full px-4 py-2 flex-row items-center mr-3">
              <Coffee color="#64748B" size={14} />
              <Text className="text-gray-600 font-bold ml-2">Cafe & Dining</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Nearby Destinations */}
        <Text className="text-primary text-sm font-bold tracking-widest uppercase mb-4">
          Nearby Destinations
        </Text>

        {filteredDestinations.length === 0 ? (
          <View className="items-center py-10">
            <Text className="text-gray-400 text-center">
              {'No places found matching "' + searchQuery + '"'}
            </Text>
          </View>
        ) : (
          filteredDestinations.map((dest) => (
            <View
              key={dest.id}
              className="bg-white rounded-2xl p-3 mb-4 flex-row shadow-sm border border-gray-50"
            >
              <Image
                source={{ uri: dest.imageUrl }}
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
                        dest.status === 'LOW'
                          ? 'bg-blue-50'
                          : dest.status === 'MODERATE'
                          ? 'bg-teal-50'
                          : 'bg-red-50'
                      }`}
                    >
                      <Text
                        className={`text-[10px] font-bold ${
                          dest.status === 'LOW'
                            ? 'text-accent'
                            : dest.status === 'MODERATE'
                            ? 'text-teal-600'
                            : 'text-busy'
                        }`}
                      >
                        {dest.status}
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
                  <TouchableOpacity>
                    <Text className="text-accent text-xs font-bold uppercase tracking-wider">
                      View Details
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}

        {/* Map Promo Card */}
        <View className="bg-primary rounded-3xl p-6 mt-4 shadow-lg overflow-hidden relative">
          <View className="absolute right-[-40px] bottom-[-20px] opacity-20">
            <MapPin size={180} color="#FFFFFF" strokeWidth={1} />
          </View>
          <Text className="text-white text-2xl font-extrabold mb-2 leading-tight">
            {'Interactive\nFlow Map'}
          </Text>
          <Text className="text-gray-300 text-sm w-2/3 mb-6">
            Real-time density updates for Bandung metropolitan area.
          </Text>
          <TouchableOpacity className="bg-white rounded-full px-5 py-3 self-start">
            <Text className="text-primary font-bold">Open Map View</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Star, Users } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

interface PlaceCardProps {
  item: any;
  /** When true, renders as a full-width vertical list card (default: false = horizontal card) */
  vertical?: boolean;
}

export const PlaceCard = ({ item, vertical = false }: PlaceCardProps) => {
  const navigation = useNavigation<any>();

  if (!item) return null;

  if (vertical) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('PlaceDetail', { place: item })}
        className="bg-white rounded-2xl mb-3 shadow-sm flex-row overflow-hidden border border-gray-100"
      >
        {/* Square image on left */}
        <Image
          source={{ uri: item.imageUrl || item.image }}
          className="w-24 h-24 bg-gray-200"
          resizeMode="cover"
        />
        {/* Details on right */}
        <View className="p-3 flex-1 justify-between">
          <View>
            <View className="flex-row justify-between items-start">
              <Text className="text-primary font-bold text-sm flex-1 mr-2" numberOfLines={1}>
                {item.name}
              </Text>
              <View className="flex-row items-center">
                <Star color="#FFB347" size={11} fill="#FFB347" />
                <Text className="text-primary text-xs font-bold ml-0.5">{item.rating}</Text>
              </View>
            </View>
            <Text className="text-gray-500 text-xs mt-0.5">{item.category}</Text>
          </View>

          <View className="flex-row justify-between items-center">
            <View className="bg-blue-50 px-2 py-1 rounded-md flex-row items-center">
              <Users color="#3AB4BA" size={11} />
              <Text className="text-accent text-xs font-bold ml-1">
                {item.occupancy ?? '--'}% Full
              </Text>
            </View>
            <Text className="text-gray-400 text-xs">{item.distance ?? ''}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Original horizontal card (kept for use elsewhere)
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('PlaceDetail', { place: item })}
      className="bg-white rounded-2xl w-72 mr-4 shadow-sm flex-row overflow-hidden border border-gray-100"
    >
      <Image source={{ uri: item.imageUrl || item.image }} className="w-28 h-full bg-gray-200" resizeMode="cover" />
      <View className="p-4 flex-1">
        <View className="flex-row justify-between items-start mb-1">
          <Text className="text-primary font-bold text-base flex-1" numberOfLines={1}>{item.name}</Text>
          <View className="flex-row items-center">
            <Star color="#FFB347" size={12} fill="#FFB347" />
            <Text className="text-primary text-xs font-bold ml-1">{item.rating}</Text>
          </View>
        </View>
        <Text className="text-gray-500 text-xs mb-3">{item.category}</Text>

        <View className="flex-row justify-between items-center mt-auto">
          <View className="bg-blue-50 px-2 py-1 rounded-md flex-row items-center">
            <Users color="#3AB4BA" size={12} />
            <Text className="text-accent text-xs font-bold ml-1">{item.occupancy ?? '--'}% Full</Text>
          </View>
          <Text className="text-gray-400 text-xs">{item.distance ?? ''}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

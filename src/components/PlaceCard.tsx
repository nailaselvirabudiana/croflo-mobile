import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Star, Users } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const PlaceCard = ({ item }: { item: any }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={() => navigation.navigate('PlaceDetail')}
      className="bg-white rounded-2xl w-72 mr-4 shadow-sm flex-row overflow-hidden border border-gray-100"
    >
      <Image source={{ uri: item.imageUrl }} className="w-28 h-full bg-gray-200" resizeMode="cover" />
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
             <Text className="text-accent text-xs font-bold ml-1">{item.occupancy}% Full</Text>
          </View>
          <Text className="text-gray-400 text-xs">{item.distance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

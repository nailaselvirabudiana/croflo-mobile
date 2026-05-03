import React from 'react';
import { View, Text } from 'react-native';
import { RadioTower } from 'lucide-react-native';
import { Place } from '../services/firestore';

interface CurrentSpotCardProps {
  place: Place;
}

export const CurrentSpotCard = ({ place }: CurrentSpotCardProps) => {
  // Determine status text and color based on occupancy
  const occupancy = place.occupancy || 0;
  let status = 'Low';
  if (occupancy > 70) status = 'Busy';
  else if (occupancy > 40) status = 'Moderate';

  const message = occupancy > 70 ? 'Peak density reached' : occupancy > 40 ? 'Moderate traffic' : 'Plenty of space';

  return (
    <View className="bg-primary rounded-3xl p-5 mb-6 shadow-md">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-gray-400 text-xs uppercase font-bold tracking-wider">Current Spot</Text>
        <View className="bg-white/20 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-bold">LIVE</Text>
        </View>
      </View>
      
      <Text className="text-white text-xl font-bold mb-4">{place.name}</Text>
      
      <View className="flex-row items-end mb-4">
        <Text className="text-white text-5xl font-extrabold leading-none">{occupancy}%</Text>
        <View className="ml-3 mb-1">
          <Text className="text-white text-sm font-bold">Occupancy</Text>
          <Text className="text-gray-400 text-xs">{message}</Text>
        </View>
      </View>

      <View className="h-2 bg-white/20 rounded-full mb-4 flex-row overflow-hidden">
         <View className="h-full bg-accent rounded-full" style={{ width: `${occupancy}%` }} />
      </View>

      <View className="flex-row items-center">
        <RadioTower color="#3AB4BA" size={16} />
        <Text className="text-accent text-sm font-bold ml-2">{status}</Text>
        <Text className="text-gray-400 text-sm ml-1">• Updated just now</Text>
      </View>
    </View>
  );
};

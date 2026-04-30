import React from 'react';
import { View, Text } from 'react-native';
import { Marker } from 'react-native-maps';
import { Coffee, Utensils, Tent } from 'lucide-react-native';

interface MapMarkerProps {
  marker: {
    id: string;
    coordinate: {
      latitude: number;
      longitude: number;
    };
    name: string;
    type: string;
  };
  onPress: (marker: any) => void;
}

export const MapMarker = ({ marker, onPress }: MapMarkerProps) => {
  const renderIcon = (type: string) => {
    switch (type) {
      case 'cafe': return <Coffee color="#FFFFFF" size={16} />;
      case 'restaurant': return <Utensils color="#FFFFFF" size={16} />;
      case 'museum': return <Tent color="#FFFFFF" size={16} />;
      default: return <Coffee color="#FFFFFF" size={16} />;
    }
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'cafe': return '#D97706';
      case 'restaurant': return '#DC2626';
      case 'museum': return '#10B981';
      default: return '#3AB4BA';
    }
  };

  return (
    <Marker 
      coordinate={marker.coordinate}
      onPress={() => onPress(marker)}
    >
      <View className="items-center">
        <View 
          className="w-10 h-10 rounded-full items-center justify-center border-4 border-white shadow-sm"
          style={{ backgroundColor: getMarkerColor(marker.type) }}
        >
          {renderIcon(marker.type)}
        </View>
        <View className="bg-white px-2 py-1 rounded-full shadow-sm mt-1 border border-gray-100">
          <Text className="text-primary text-[10px] font-bold">{marker.name}</Text>
        </View>
      </View>
    </Marker>
  );
};

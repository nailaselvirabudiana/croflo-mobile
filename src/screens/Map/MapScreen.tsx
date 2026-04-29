import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { LocateFixed, Layers, Coffee, Utensils, Tent, X, Users, Clock, TrendingDown } from 'lucide-react-native';
import { MAP_MARKERS } from '../../data/mockData';

export const MapScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

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
    <View className="flex-1 bg-background relative">
      <MapView 
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: -6.914,
          longitude: 107.610,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {MAP_MARKERS.map((marker) => (
          <Marker 
            key={marker.id} 
            coordinate={marker.coordinate}
            onPress={() => setSelectedMarker(marker)}
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
        ))}
      </MapView>

      {/* Floating Controls */}
      <View className="absolute top-16 right-5 gap-3">
        <TouchableOpacity className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-md">
          <LocateFixed color="#0A1D37" size={20} />
        </TouchableOpacity>
        <TouchableOpacity className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-md">
          <Layers color="#0A1D37" size={20} />
        </TouchableOpacity>
      </View>

      {/* Bottom Detail Card */}
      {selectedMarker && (
        <View className="absolute bottom-28 left-5 right-5 bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="text-primary text-xl font-extrabold mb-1">{selectedMarker.name}</Text>
              <View className="flex-row items-center">
                <Text className="text-green-600 text-xs font-bold tracking-wider">{selectedMarker.status || 'MODERATE CROWD'}</Text>
                <Text className="text-gray-400 text-xs ml-2">• {selectedMarker.distance || 'Near you'}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setSelectedMarker(null)} className="p-1">
              <X color="#64748B" size={20} />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between mb-6">
             <View className="bg-blue-50 flex-1 rounded-2xl items-center py-3 mr-2">
               <Users color="#0A1D37" size={18} className="mb-1" />
               <Text className="text-primary font-bold text-xs">{selectedMarker.capacity || 40}% Cap</Text>
             </View>
             <View className="bg-green-50 border border-green-100 flex-1 rounded-2xl items-center py-3 mr-2">
               <Clock color="#16A34A" size={18} className="mb-1" />
               <Text className="text-primary font-bold text-xs">{selectedMarker.waitTime || '10 min Wait'}</Text>
             </View>
             <View className="bg-blue-50 flex-1 rounded-2xl items-center py-3">
               <TrendingDown color="#0A1D37" size={18} className="mb-1" />
               <Text className="text-primary font-bold text-xs">{selectedMarker.trend || 'Stable'}</Text>
             </View>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('PlaceDetail')} className="bg-primary rounded-2xl py-4 items-center justify-center shadow-md flex-row">
            <Text className="text-white font-bold text-base mr-2">See Details</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

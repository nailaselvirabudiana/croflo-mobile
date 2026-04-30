import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView from 'react-native-maps';
import { LocateFixed, Layers, X, Users, Clock, TrendingDown } from 'lucide-react-native';
import { MAP_MARKERS } from '../../data/mockData';
import { MapMarker } from '../../components/MapMarker';

export const MapScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

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
          <MapMarker 
            key={marker.id} 
            marker={marker}
            onPress={setSelectedMarker}
          />
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

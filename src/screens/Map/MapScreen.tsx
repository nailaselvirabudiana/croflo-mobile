import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { LocateFixed, Layers, X, Users, Clock, TrendingDown } from 'lucide-react-native';
import { MapMarker } from '../../components/MapMarker';
import { subscribeToPlaces, Place } from '../../services/firestore';

// Default center – Dago Bandung (fallback jika GPS dimatikan)
const DEFAULT_REGION: Region = {
  latitude: -6.890,
  longitude: 107.615,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

export const MapScreen = () => {
  const navigation = useNavigation<any>();
  const mapRef = useRef<MapView>(null);

  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [markers, setMarkers] = useState<Place[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  // ─── Get user location ─────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Izin Lokasi Diperlukan',
          'Aktifkan izin lokasi agar peta bisa mengikuti posisi kamu.',
        );
        setLocationLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = loc.coords;
      setUserLocation({ latitude, longitude });

      // Fly map to user location
      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 800);

      setLocationLoading(false);
    })();
  }, []);

  // ─── Subscribe to Firestore places ────────────────────────────────────
  useEffect(() => {
    const unsubscribe = subscribeToPlaces((data) => {
      console.log(`[MapScreen] Received ${data.length} places from Firestore`);
      data.forEach(p => {
        console.log(`  → ${p.name}: lat=${p.latitude}, lng=${p.longitude}, cat=${p.category}`);
      });
      // Keep only places with valid non-zero coordinates
      const valid = data.filter(p => p.latitude !== 0 && p.longitude !== 0);
      console.log(`[MapScreen] ${valid.length} places with valid coordinates`);
      setMarkers(valid);
    });
    return () => unsubscribe();
  }, []);

  // ─── Helpers ───────────────────────────────────────────────────────────
  const getCrowdInfo = (occupancy?: number) => {
    if (occupancy === undefined || occupancy === null) return { text: 'UNKNOWN', color: '#94A3B8' };
    if (occupancy < 30) return { text: 'LOW CROWD', color: '#16A34A' };
    if (occupancy < 70) return { text: 'MODERATE CROWD', color: '#D97706' };
    return { text: 'HIGH CROWD', color: '#DC2626' };
  };

  const flyToUser = async () => {
    if (userLocation) {
      mapRef.current?.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 600);
    } else {
      Alert.alert('Lokasi tidak tersedia', 'Pastikan GPS aktif dan izin lokasi diberikan.');
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={DEFAULT_REGION}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
      >
        {markers.map((place) => (
          <MapMarker
            key={place.id}
            marker={{
              ...place,
              coordinate: {
                latitude: place.latitude,
                longitude: place.longitude,
              },
              type: place.category,
            }}
            onPress={setSelectedMarker}
          />
        ))}
      </MapView>

      {/* Floating Controls */}
      <View className="absolute top-16 right-5" style={{ gap: 10 }}>
        <TouchableOpacity
          className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-md"
          onPress={flyToUser}
        >
          {locationLoading ? (
            <ActivityIndicator size="small" color="#3AB4BA" />
          ) : (
            <LocateFixed color="#0A1D37" size={20} />
          )}
        </TouchableOpacity>
        <TouchableOpacity className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-md">
          <Layers color="#0A1D37" size={20} />
        </TouchableOpacity>
      </View>

      {/* Marker count badge (debug helper, bisa dihapus nanti) */}
      {markers.length > 0 && (
        <View className="absolute top-16 left-5 bg-white px-3 py-2 rounded-full shadow-md border border-gray-100">
          <Text className="text-primary text-xs font-bold">{markers.length} Tempat</Text>
        </View>
      )}

      {/* Bottom Detail Card */}
      {selectedMarker && (() => {
        const crowd = getCrowdInfo(selectedMarker.occupancy);
        return (
          <View className="absolute bottom-28 left-5 right-5 bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1 mr-3">
                <Text className="text-primary text-xl font-extrabold mb-1" numberOfLines={1}>
                  {selectedMarker.name}
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-xs font-bold tracking-wider" style={{ color: crowd.color }}>
                    {crowd.text}
                  </Text>
                  <Text className="text-gray-400 text-xs ml-2">
                    • {selectedMarker.distance || 'Near you'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setSelectedMarker(null)} className="p-1">
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between mb-5">
              <View className="bg-blue-50 flex-1 rounded-2xl items-center py-3 mr-2">
                <Users color="#0A1D37" size={18} />
                <Text className="text-primary font-bold text-xs mt-1">
                  {selectedMarker.occupancy ?? '--'}% Cap
                </Text>
              </View>
              <View className="bg-green-50 border border-green-100 flex-1 rounded-2xl items-center py-3 mr-2">
                <Clock color="#16A34A" size={18} />
                <Text className="text-primary font-bold text-xs mt-1">
                  {selectedMarker.waitTime || '~10 min'}
                </Text>
              </View>
              <View className="bg-blue-50 flex-1 rounded-2xl items-center py-3">
                <TrendingDown color="#0A1D37" size={18} />
                <Text className="text-primary font-bold text-xs mt-1">
                  {selectedMarker.waitTrend || 'Stable'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('PlaceDetail', { place: selectedMarker })}
              className="bg-primary rounded-2xl py-4 items-center justify-center flex-row"
            >
              <Text className="text-white font-bold text-base">See Details →</Text>
            </TouchableOpacity>
          </View>
        );
      })()}
    </View>
  );
};

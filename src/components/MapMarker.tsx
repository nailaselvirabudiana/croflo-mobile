import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Marker } from 'react-native-maps';
import { Coffee, ShoppingBag, Landmark, Utensils, BookOpen, MapPin } from 'lucide-react-native';

interface MapMarkerProps {
  marker: {
    id: string;
    coordinate: {
      latitude: number;
      longitude: number;
    };
    name: string;
    type: string;
    occupancy?: number;
  };
  onPress: (marker: any) => void;
}

const getConfig = (category: string): { color: string; Icon: any } => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('cafe') || cat.includes('coffee'))
    return { color: '#D97706', Icon: Coffee };
  if (cat.includes('mall') || cat.includes('shop'))
    return { color: '#DC2626', Icon: ShoppingBag };
  if (cat.includes('museum') || cat.includes('wisata'))
    return { color: '#10B981', Icon: Landmark };
  if (cat.includes('restaurant') || cat.includes('resto') || cat.includes('food'))
    return { color: '#DC2626', Icon: Utensils };
  if (cat.includes('edu') || cat.includes('university') || cat.includes('school') || cat.includes('itb'))
    return { color: '#6366F1', Icon: BookOpen };
  return { color: '#3AB4BA', Icon: MapPin };
};

export const MapMarker = ({ marker, onPress }: MapMarkerProps) => {
  const { color, Icon } = getConfig(marker.type);
  // On Android, we need tracksViewChanges=true initially so the custom view
  // gets rendered, then flip it off for performance after first paint.
  const [tracked, setTracked] = useState(Platform.OS === 'android');

  return (
    <Marker
      coordinate={marker.coordinate}
      onPress={() => onPress(marker)}
      tracksViewChanges={tracked}
      onLayout={() => {
        // After the first layout, stop tracking for performance
        if (tracked) {
          setTimeout(() => setTracked(false), 500);
        }
      }}
    >
      <View style={styles.container}>
        {/* Colored circle with icon */}
        <View style={[styles.circle, { backgroundColor: color }]}>
          <Icon color="#FFFFFF" size={16} />
        </View>
        {/* Name label */}
        <View style={styles.label}>
          <Text style={styles.labelText} numberOfLines={1}>
            {marker.name}
          </Text>
        </View>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 120,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  labelText: {
    color: '#0A1D37',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
});

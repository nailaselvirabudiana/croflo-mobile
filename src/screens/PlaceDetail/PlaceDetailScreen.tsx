import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, TrendingDown, Bookmark } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BarChart } from 'react-native-gifted-charts';
import Svg, { Circle } from 'react-native-svg';
import { WebView } from 'react-native-webview';
import { PLACE_DETAILS } from '../../data/mockData';
import {
  Place,
  savePlace,
  unsavePlace,
  isPlaceSaved,
} from '../../services/firestore';
import { useAuth } from '../../contexts/AuthContext';

const LATEST_API = 'http://13.213.18.54:8000/latest';
const VIDEO_STREAM_URL = 'http://13.213.18.54:8000/video';

export const PlaceDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { user } = useAuth();
  const { place } = route.params || { place: PLACE_DETAILS };

  // ─── People count from API ──────────────────────────────────────────────
  const [peopleCount, setPeopleCount] = useState<number | null>(null);
  const [loadingCount, setLoadingCount] = useState(true);

  // ─── Saved state ────────────────────────────────────────────────────────
  const [saved, setSaved] = useState(false);
  const [savingInProgress, setSavingInProgress] = useState(false);

  // Fetch people count
  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch(LATEST_API);
      const json = await res.json();
      // count is a float – round up
      setPeopleCount(Math.ceil(json.count ?? 0));
    } catch (e) {
      console.warn('Failed to fetch people count', e);
    } finally {
      setLoadingCount(false);
    }
  }, []);

  // Check saved status
  const checkSaved = useCallback(async () => {
    if (!user) return;
    const result = await isPlaceSaved(user.uid, place.id);
    setSaved(result);
  }, [user, place.id]);

  useEffect(() => {
    fetchCount();
    checkSaved();

    // Refresh people count every 30 seconds
    const interval = setInterval(() => {
      fetchCount();
    }, 30_000);

    return () => clearInterval(interval);
  }, [fetchCount, checkSaved]);

  // Toggle saved
  const handleToggleSave = async () => {
    if (!user) {
      Alert.alert('Sign in required', 'Please sign in to save places.');
      return;
    }
    setSavingInProgress(true);
    try {
      if (saved) {
        await unsavePlace(user.uid, place.id);
        setSaved(false);
      } else {
        await savePlace(user.uid, place as Place);
        setSaved(true);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not update saved status. Please try again.');
    } finally {
      setSavingInProgress(false);
    }
  };

  // Circular progress component
  const CircularProgress = ({
    value,
    max,
  }: {
    value: number;
    max: number;
  }) => {
    const radius = 35;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const ratio = max > 0 ? Math.min(value / max, 1) : 0;
    const strokeDashoffset = circumference - ratio * circumference;

    return (
      <View className="items-center justify-center relative">
        <Svg width="90" height="90" viewBox="0 0 100 100">
          <Circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#3AB4BA"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </Svg>
        <View className="absolute items-center">
          <Text className="text-primary text-xl font-extrabold leading-none">
            {value}
          </Text>
          <Text className="text-gray-400 text-[10px]">orang</Text>
        </View>
      </View>
    );
  };

  const chartData = (place.forecast || PLACE_DETAILS.forecast).map(
    (f: any) => ({
      value: f.value,
      label: f.time,
      frontColor: f.time === '14:00' ? '#3AB4BA' : '#E2E8F0',
    })
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView
        className="flex-1 px-5 pt-4 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <ArrowLeft color="#0A1D37" size={24} />
          </TouchableOpacity>
          <Text className="text-accent text-xl font-extrabold tracking-wide flex-1">
            Cro<Text className="text-primary">flo</Text>
          </Text>

          {/* Save button */}
          <TouchableOpacity
            onPress={handleToggleSave}
            disabled={savingInProgress}
            className="p-2 rounded-full"
            style={{ backgroundColor: saved ? '#EFF9FA' : '#F1F5F9' }}
          >
            {savingInProgress ? (
              <ActivityIndicator size="small" color="#3AB4BA" />
            ) : (
              <Bookmark
                color={saved ? '#3AB4BA' : '#94A3B8'}
                fill={saved ? '#3AB4BA' : 'none'}
                size={22}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View className="mb-6">
          <View className="flex-row justify-between items-start mb-1">
            <Text
              className="text-primary text-2xl font-extrabold flex-1"
              numberOfLines={2}
            >
              {place.name}
            </Text>
            <View className="bg-blue-50 px-2 py-1 rounded-md flex-row items-center ml-2">
              <Star color="#3AB4BA" size={14} fill="#3AB4BA" />
              <Text className="text-accent text-sm font-bold ml-1">
                {place.rating}
              </Text>
            </View>
          </View>
          <Text className="text-gray-500 text-sm">
            {place.address || 'Bandung, Indonesia'}
          </Text>
        </View>

        {/* Stat Cards */}
        <View className="flex-row justify-between mb-6">
          {/* People count card */}
          <View className="bg-white rounded-3xl p-5 w-[48%] shadow-sm items-center justify-center border border-gray-100">
            <Text className="text-primary text-xs font-bold mb-4 uppercase tracking-wider text-center">
              Jumlah Orang
            </Text>
            {loadingCount ? (
              <ActivityIndicator color="#3AB4BA" size="large" />
            ) : (
              <CircularProgress
                value={peopleCount ?? 0}
                max={place.totalSeats || 50}
              />
            )}
          </View>

          {/* Wait Time */}
          <View className="bg-primary rounded-3xl p-5 w-[48%] shadow-sm justify-between">
            <View>
              <Text className="text-gray-400 text-xs font-bold mb-1 uppercase tracking-wider">
                Est. Wait Time
              </Text>
              <Text className="text-white text-3xl font-extrabold">
                {place.waitTime || '~8 Min'}
              </Text>
            </View>
            <View className="bg-white/10 px-3 py-2 rounded-lg flex-row items-center mt-4">
              <TrendingDown color="#E2E8F0" size={14} />
              <Text className="text-gray-300 text-xs ml-2">
                {place.waitTrend || 'Stable'}
              </Text>
            </View>
          </View>
        </View>

        {/* Live Visual Feed — MJPEG video stream */}
        <View className="rounded-3xl overflow-hidden mb-6 shadow-md bg-gray-900" style={{ height: 220 }}>
          {/* Live badge */}
          <View className="absolute top-4 left-4 z-10 bg-busy px-3 py-1.5 rounded-md flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-white mr-2" />
            <Text className="text-white text-xs font-bold uppercase tracking-wider">
              Live Visual Feed
            </Text>
          </View>

          <WebView
            source={{
              html: `
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                    <style>
                      * { margin: 0; padding: 0; }
                      body { background: #111827; display: flex; align-items: center; justify-content: center; width: 100vw; height: 100vh; overflow: hidden; }
                      img { width: 100%; height: 100%; object-fit: cover; }
                    </style>
                  </head>
                  <body>
                    <img src="${VIDEO_STREAM_URL}" alt="Live Feed" />
                  </body>
                </html>
              `,
            }}
            style={{ flex: 1, backgroundColor: '#111827' }}
            javaScriptEnabled
            scrollEnabled={false}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            originWhitelist={['*']}
            mixedContentMode="always"
          />

          {/* Camera label */}
          <View className="absolute bottom-4 right-4 bg-black/50 px-3 py-1.5 rounded-full border border-gray-700">
            <Text className="text-gray-300 text-[10px] font-mono tracking-widest">
              CAM_04 // DAGO_MAIN
            </Text>
          </View>
        </View>

        {/* Occupancy Forecast */}
        <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-8">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-primary text-lg font-bold">
              Occupancy Forecast
            </Text>
            <View className="bg-blue-50 px-3 py-1 rounded-full">
              <Text className="text-accent text-xs font-bold uppercase">
                Today
              </Text>
            </View>
          </View>

          <View className="items-center h-48 justify-center">
            <BarChart
              data={chartData}
              barWidth={22}
              spacing={12}
              roundedTop
              roundedBottom
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: 'transparent' }}
              noOfSections={3}
              maxValue={100}
              initialSpacing={0}
              xAxisLabelTextStyle={{
                color: '#0A1D37',
                fontSize: 10,
                fontWeight: 'bold',
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

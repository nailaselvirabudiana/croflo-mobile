import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, TrendingDown } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { BarChart } from 'react-native-gifted-charts';
import Svg, { Circle } from 'react-native-svg';
import { PLACE_DETAILS } from '../../data/mockData';

export const PlaceDetailScreen = () => {
  const navigation = useNavigation();

  // Simple Circular Progress
  const CircularProgress = ({ value, max }: { value: number, max: number }) => {
    const radius = 35;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / max) * circumference;

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
          <Text className="text-primary text-xl font-extrabold leading-none">{value}</Text>
          <Text className="text-gray-400 text-[10px]">/ {max}</Text>
        </View>
      </View>
    );
  };

  const chartData = PLACE_DETAILS.forecast.map(f => ({
    value: f.value,
    label: f.time,
    frontColor: f.time === '14:00' ? '#3AB4BA' : '#E2E8F0',
  }));

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1 px-5 pt-4 pb-10" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <ArrowLeft color="#0A1D37" size={24} />
          </TouchableOpacity>
          <Text className="text-accent text-xl font-extrabold tracking-wide">Cro<Text className="text-primary">flo</Text></Text>
        </View>

        {/* Hero */}
        <View className="mb-6">
          <View className="flex-row justify-between items-start mb-1">
            <Text className="text-primary text-2xl font-extrabold flex-1" numberOfLines={2}>{PLACE_DETAILS.name}</Text>
            <View className="bg-blue-50 px-2 py-1 rounded-md flex-row items-center ml-2">
              <Star color="#3AB4BA" size={14} fill="#3AB4BA" />
              <Text className="text-accent text-sm font-bold ml-1">{PLACE_DETAILS.rating}</Text>
            </View>
          </View>
          <Text className="text-gray-500 text-sm">{PLACE_DETAILS.address}</Text>
        </View>

        {/* Stat Cards */}
        <View className="flex-row justify-between mb-6">
          {/* Available Seats */}
          <View className="bg-white rounded-3xl p-5 w-[48%] shadow-sm items-center justify-center border border-gray-100">
            <Text className="text-primary text-xs font-bold mb-4 uppercase tracking-wider text-center">Available Seats</Text>
            <CircularProgress value={PLACE_DETAILS.availableSeats} max={PLACE_DETAILS.totalSeats} />
          </View>

          {/* Wait Time */}
          <View className="bg-primary rounded-3xl p-5 w-[48%] shadow-sm justify-between">
            <View>
              <Text className="text-gray-400 text-xs font-bold mb-1 uppercase tracking-wider">Est. Wait Time</Text>
              <Text className="text-white text-3xl font-extrabold">{PLACE_DETAILS.waitTime}</Text>
            </View>
            <View className="bg-white/10 px-3 py-2 rounded-lg flex-row items-center mt-4">
              <TrendingDown color="#E2E8F0" size={14} />
              <Text className="text-gray-300 text-xs ml-2">{PLACE_DETAILS.waitTrend}</Text>
            </View>
          </View>
        </View>

        {/* Live Visual Feed */}
        <View className="bg-gray-900 rounded-3xl h-48 mb-6 p-4 justify-between shadow-md">
          <View className="bg-busy px-3 py-1.5 rounded-md self-start flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-white mr-2" />
            <Text className="text-white text-xs font-bold uppercase tracking-wider">Live Visual Feed</Text>
          </View>
          <View className="self-end bg-black/50 px-3 py-1.5 rounded-full border border-gray-700">
            <Text className="text-gray-300 text-[10px] font-mono tracking-widest">CAM_04 // DAGO_MAIN</Text>
          </View>
        </View>

        {/* Occupancy Forecast */}
        <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-8">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-primary text-lg font-bold">Occupancy Forecast</Text>
            <View className="bg-blue-50 px-3 py-1 rounded-full">
              <Text className="text-accent text-xs font-bold uppercase">Today</Text>
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
              xAxisLabelTextStyle={{ color: '#0A1D37', fontSize: 10, fontWeight: 'bold' }}
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

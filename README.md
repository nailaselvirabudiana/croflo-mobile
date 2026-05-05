# Croflo Mobile

A React Native mobile application built with Expo, providing location-based crowd tracking, occupancy monitoring, recommended destinations, and mapping integration. 

## Features
- **Real-Time Location Tracking**: Integrated with `react-native-maps` and `expo-location`.
- **Occupancy & Crowd Monitoring**: View live data to avoid crowded areas.
- **Live Video Feed**: Watch live feeds from select locations via WebView.
- **Firebase Integration**: Utilizes Firebase Cloud Firestore for real-time data sync and authentication.
- **Beautiful UI**: Styled with `nativewind` (Tailwind CSS) and interactive charts using `react-native-gifted-charts`.

## Tech Stack
- **Framework**: React Native with [Expo](https://expo.dev/)
- **Navigation**: React Navigation (Bottom Tabs, Native Stack)
- **Styling**: Tailwind CSS & NativeWind
- **Backend / Database**: Firebase
- **Maps**: React Native Maps
- **Data Visualization**: React Native Gifted Charts

## Getting Started

### Prerequisites
- Node.js installed
- Expo CLI or Expo Go app on your physical device

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npm start
   ```

### Running on Device
- **Android**: Press `a` in the terminal after running `npm start`, or use `npm run android`
- **iOS**: Press `i` in the terminal after running `npm start`, or use `npm run ios`
- **Web**: Press `w` in the terminal after running `npm start`, or use `npm run web`

## Project Structure
- `/src` - Contains the source code for the application including screens, components, services, and navigation.
- `FirebaseConfig.ts` - Firebase configuration and initialization.
- `app.json` - Expo app configuration.
- `tailwind.config.js` - Tailwind CSS configuration.

## License
Private Project.

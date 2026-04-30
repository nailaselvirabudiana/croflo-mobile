import React, { useEffect } from 'react';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { registerForPushNotificationsAsync } from './src/services/notifications';
import { seedDatabase } from './src/scripts/seedDatabase';

export default function App() {
  useEffect(() => {
    // Request notification permissions
    registerForPushNotificationsAsync();

    // Uncomment this line to seed the database with the Dago locations
    // You only need to run this ONCE.
    // seedDatabase();
  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

// app/_layout.tsx
import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { DataProvider } from '../context/DataContext';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <DataProvider>
          <Stack>
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </DataProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

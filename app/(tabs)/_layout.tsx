import { Stack } from 'expo-router';
import React from 'react';

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Pantalla de Bienvenida */}
      <Stack.Screen name="index" />
      {/* Pantalla Principal con menú lateral */}
      <Stack.Screen name="principal" />
      {/* Pantallas de autenticación */}
      <Stack.Screen name="auth" />

      <Stack.Screen name="login" />
      
      <Stack.Screen name="register" />
    </Stack>
  );
}

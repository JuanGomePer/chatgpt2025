import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ruta no encontrada</Text>
      <Link href="/" style={styles.link}>
        Volver al inicio
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#343541',
  },
  title: {
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#fff',
    marginBottom: 16,
  },
  link: {
    fontSize: 16,
    color: '#10a37f',
  },
});

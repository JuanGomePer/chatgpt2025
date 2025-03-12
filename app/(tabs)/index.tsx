// app/(tabs)/index.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  const goToChat = () => {
    // Navega a la pantalla principal
    router.push('/auth');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ChatGPT</Text>
      <Text style={styles.subtitle}>Ask anything, get your answer</Text>

      <View style={styles.examplesContainer}>
        <Text style={styles.examplesTitle}>Examples</Text>

        <View style={styles.exampleItem}>
          <Text style={styles.exampleText}>• Explain quantum computing in simple terms</Text>
        </View>

        <View style={styles.exampleItem}>
          <Text style={styles.exampleText}>• Got any creative ideas for a 10 year old&apos;s birthday?</Text>
        </View>

        <View style={styles.exampleItem}>
          <Text style={styles.exampleText}>• How do I make an HTTP request in JavaScript?</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={goToChat}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#343541',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ececf1',
    textAlign: 'center',
    marginBottom: 24,
  },
  examplesContainer: {
    marginBottom: 24,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ececf1',
    marginBottom: 12,
    textAlign: 'center',
  },
  exampleItem: {
    backgroundColor: '#444654',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  exampleText: {
    color: '#ececf1',
    fontSize: 14,
  },
  nextButton: {
    alignSelf: 'center',
    backgroundColor: '#10a37f',
    borderRadius: 4,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 12,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

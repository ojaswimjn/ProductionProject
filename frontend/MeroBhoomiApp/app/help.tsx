import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';

const HelpPage = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Help & Guide',
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Getting Started 🚀</Text>

        {helpSteps.map((step, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.stepNumber}>{`Step ${index + 1}`}</Text>
            <Text style={styles.cardTitle}>{step.title}</Text>
            <Text style={styles.cardText}>{step.description}</Text>
          </View>
        ))}

        <Text style={styles.footer}>
          🌍 Thank you for being a part of a sustainable future!
        </Text>
      </ScrollView>
    </View>
  );
};

const helpSteps = [
  {
    title: 'Register or Log In',
    description: 'Create an account or sign in to start tracking and managing your waste efficiently.',
  },
  {
    title: 'Upload Waste Image',
    description: 'Take or select a photo of your waste. Our AI classifies it into recyclable or organic types.',
  },
  {
    title: 'Schedule a Pickup',
    description: 'Choose waste type, weight, and a convenient time. Pick your location on the map and submit.',
  },
  {
    title: 'Earn Eco-Points',
    description: 'Gain points for every successful pickup. Redeem them later for cashback or rewards.',
  },
  {
    title: 'Check Tips & Analytics',
    description: 'Explore eco-tips and view your waste stats to see your impact over time.',
  },
  {
    title: 'Mark Pickups as Done',
    description: 'Staff or admin can complete the pickup by marking requests as picked up.',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  stepNumber: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  footer: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default HelpPage;

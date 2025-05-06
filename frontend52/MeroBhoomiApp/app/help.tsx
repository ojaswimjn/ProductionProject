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
        <Text style={styles.heading}> Features Overview</Text>

        {helpFeatures.map((feature, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>{index + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{feature.title}</Text>
              <Text style={styles.cardText}>{feature.description}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.footer}>
          🌍 Thank you for being a part of a sustainable future!
        </Text>
      </ScrollView>
    </View>
  );
};

const helpFeatures = [
  {
    title: 'Upload Waste Image',
    description: 'Capture or select a photo. Our AI classifies it into recyclable waste categories like plastic, paper, glass, cardboard, metal, and trash. Upload one photo at a time with possibly empty background.',
  },
  {
    title: 'Schedule a Pickup',
    description: 'You can schedule only organic waste pickups. Choose weight, location, and a convenient date (Tuesdays and Fridays only).',
  },
  {
    title: 'Earn Eco-Points',
    description: 'Collect points with each successful pickup. Earn additional rewards for recycling efforts.',
  },
  {
    title: 'Explore Tips',
    description: 'Discover eco-friendly habits and waste management advice.',
  },
  {
    title: 'View Waste Analytics',
    description: 'Monitor your waste progress status.',
  },
  {
    title: 'Pickup Management',
    description: 'Our staff will update the status to "picked up" once your waste has been collected.',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#888',
    // shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0284C7',
  },
  cardTitle: {
    // fontSize: 18,
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  footer: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 30,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default HelpPage;

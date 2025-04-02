import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Import icons

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {TouchableOpacity} from 'react-native';
import { useRouter } from "expo-router";


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            height: 80, // Increase the height of the navbar
            paddingBottom: 20, // More space for icons
            paddingTop: 10, // Adjust top padding
          },
          android: {
            height: 60, // Adjust for Android as well
            // paddingBottom: 20,
            // paddingTop: 10,
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="scheduleWaste"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="calendar-outline" color={color} />,
        }}
      />
            <Tabs.Screen
        name="scannerScreen"
        options={{
          title: '',
          tabBarButton: () => (
            <TouchableOpacity
              onPress={() => router.push('/scannerScreen')} // Navigate to scanner screen
              activeOpacity={0.7} // Slight opacity change on press
              style={{
                backgroundColor: '#2B4B40',
                borderRadius: 50,
                borderColor: 'white',
                width: 70,
                height: 70,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                bottom: 25,
                left: 10,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
            >
              <Ionicons size={38} name="qr-code-outline" color={'white'} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="pointsReedemptionScreen"
        options={{
          title: 'Points',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={24} name="gift-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profileScreen"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="person-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}

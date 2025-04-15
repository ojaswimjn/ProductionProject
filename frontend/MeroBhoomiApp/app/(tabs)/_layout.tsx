import { Tabs } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { addNotificationReceivedListener, addNotificationResponseReceivedListener, Subscription } from 'expo-notifications';

// ✅ Setup foreground handler (important!)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function TabLayout() {
  const notificationListener = useRef<Subscription | null>(null);
  const responseListener = useRef<Subscription | null>(null);


  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('📬 Notification received in foreground:', notification);
    });
  
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification response (tapped):', response);
    });
  
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

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
            height: 80,
            paddingBottom: 20,
            paddingTop: 10,
          },
          android: {
            height: 60,
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
              onPress={() => router.push('/scannerScreen')}
              activeOpacity={0.7}
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

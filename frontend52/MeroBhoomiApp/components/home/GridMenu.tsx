import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import  { width, height } from '../../app/(tabs)/index'
import { getUserProfile } from '@/app/services/authDisplayProfile';



const GridMenu = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin]= useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserProfile();
        console.log("userDataaaaaaa", userData);

        if (userData.user_role === 'admin') {
          console.log("Admin role detected");
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchUser();
  }, []); 

  const menuItems = [
    { title: 'Schedule', icon: 'clock-outline', route: '/scheduleWaste' },
    { title: 'Recycle', icon: 'recycle', route: '/scannerScreen' },
    ...(isAdmin
      ? [{ title: 'Prediction', icon: 'trending-up', route: '/adminFutureWastePrediction' }]
      : [{ title: 'Tips', icon: 'lightbulb-outline', route: '/tips' }]),
      ...(isAdmin
        ? [{ title: 'Route', icon: 'chart-line', route: '/adminRouteOptimization' }]
        : [{ title: 'Recyclers', icon: 'map-marker', route: '/recyclerMap' }]),
    ...(isAdmin
      ? [{ title: 'Analytics', icon: 'chart-line', route: '/adminAnalytics' }]
      : [{ title: 'Analytics', icon: 'chart-line', route: '/customerAnalytics' }]),
      ...(isAdmin
        ? [{ title: 'PickUp ', icon: 'truck', route: '/adminPickupStatusUpdate' }]
        : [{ title: 'Help', icon: 'hand-circle-outline', route: '/help' }]),
  ];

  return (
    <View style={styles.container}>
      {menuItems.map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.button} 
          onPress={() => router.push(item.route as any)}
        >
          <Icon name={item.icon} size={24} color="black" />
          <Text style={styles.text}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: '#E8F6EF',
    width: '100%',
    alignSelf: 'center',
    marginTop: '1%',
    paddingBottom: '1%'
   
  },
  button: {
    width: '28%',
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    marginVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
    elevation: 3,
  },
  text: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#2B4B40',
  },
});

export default GridMenu;

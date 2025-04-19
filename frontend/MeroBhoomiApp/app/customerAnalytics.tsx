import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASEURL } from './authDisplayService';
import { Stack } from 'expo-router';
import { getUserProfile } from './services/authDisplayProfile';

interface PickupRequest {
    pickup_request_id: number;
    request_date: string;
    request_status: string;
    weight: number;
    weight_metric: string;
    waste_type: string;
    latitude: number;
    longitude: number;
    user_id: number;
  }

  
const AdminAnalytics = () => {
    const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPickupRequests();
  }, []);

  const fetchPickupRequests = async () => {
    try {
      const userProfile = await getUserProfile();
      const user_id = userProfile.id;      
  
      const accessToken = await AsyncStorage.getItem("accessToken");
      const res = await axios.get(`${API_BASEURL}/pickuprequest/user/${user_id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      const sortedData = res.data.sort((a: PickupRequest, b: PickupRequest) => {
        return new Date(b.request_date).getTime() - new Date(a.request_date).getTime();
      });
  
      setPickupRequests(sortedData);
    } catch (error) {
      console.error("Error fetching pickup requests", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Pickup Requests',
        }}
      />

      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Pickup Requests</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2B4B40" />
        ) : pickupRequests.length === 0 ? (
          <Text style={styles.noData}>No pickup requests found.</Text>
        ) : (
          pickupRequests.map((item) => (
            <View key={item.pickup_request_id} style={styles.requestBox}>
              <Text style={styles.requestText}>📅 Date: {item.request_date}</Text>
              <Text style={styles.requestText}>⚖️ Weight: {item.weight} {item.weight_metric}</Text>
              <Text style={styles.requestText}>🗑️ Type: {item.waste_type}</Text>
              <Text style={styles.requestText}>📍 Location: {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</Text>
              <Text style={styles.requestStatus}>Status: {item.request_status}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </>
  );
};

export default AdminAnalytics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2B4B40',
    textAlign: 'center',
    marginBottom: 16,
  },
  requestBox: {
    backgroundColor: '#F0F5F3',
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  requestText: {
    fontSize: 14,
    color: '#2B4B40',
    marginBottom: 4,
  },
  requestStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A3B32',
    marginTop: 4,
  },
  noData: {
    textAlign: 'center',
    fontSize: 14,
    color: 'gray',
    marginTop: 20,
  },
});

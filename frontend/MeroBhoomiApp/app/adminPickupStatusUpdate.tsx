import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASEURL } from './authDisplayService';
import { Stack } from 'expo-router';

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

const MarkPickupPage = () => {
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPickupRequests();
  }, []);

  const fetchPickupRequests = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const res = await axios.get(`${API_BASEURL}/pickuprequest/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Sort by latest date first
      const sortedRequests = res.data.sort((a: PickupRequest, b: PickupRequest) =>
        new Date(b.request_date).getTime() - new Date(a.request_date).getTime()
      );

      setPickupRequests(sortedRequests);
    } catch (error) {
      console.error('Error fetching pickup requests', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsPickedUp = async (pickupRequestId: number) => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const res = await axios.patch(`${API_BASEURL}/pickuprequest/${pickupRequestId}/complete/`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      alert(res.data.message);
      fetchPickupRequests(); // Refresh
    } catch (error) {
      console.error('Error marking pickup as picked up', error);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Pickup Status',
        }}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#2B4B40" style={{ marginTop: 30 }} />
      ) : pickupRequests.length === 0 ? (
        <Text style={styles.emptyText}>No pickup requests found.</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {pickupRequests.map((item) => (
            <View key={item.pickup_request_id} style={styles.requestBox}>
              <Text style={styles.title}>Pickup No.{item.pickup_request_id}</Text>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{new Date(item.request_date).toLocaleDateString()}</Text>

              <Text style={styles.label}>Weight:</Text>
              <Text style={styles.value}>{item.weight} {item.weight_metric}</Text>

              <Text style={styles.label}>Waste Type:</Text>
              <Text style={styles.value}>{item.waste_type}</Text>

              <Text style={styles.label}>Status:</Text>
              <Text style={[styles.value, { fontWeight: 'bold', color: item.request_status === 'Picked up' ? '#2B4B40' : '#FF6B6B' }]}>
                {item.request_status}
              </Text>

              {item.request_status !== 'Picked up' && (
                <TouchableOpacity
                  onPress={() => markAsPickedUp(item.pickup_request_id)}
                  style={styles.completeButton}
                >
                  <Text style={styles.buttonText}>Mark as Picked Up</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  requestBox: {
    backgroundColor: '#F8F9F9',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
},
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2B4B40',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginTop: 4,
  },
  value: {
    fontSize: 14,
    color: '#2B4B40',
  },
  completeButton: {
    backgroundColor: '#2B4B40',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
  },
});

export default MarkPickupPage;

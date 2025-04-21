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
  const [selectedRequests, setSelectedRequests] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    fetchPickupRequests();
  }, []);

  const fetchPickupRequests = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`${API_BASEURL}/pickuprequest/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const sortedRequests = response.data.sort((a: PickupRequest, b: PickupRequest) =>
        new Date(b.request_date).getTime() - new Date(a.request_date).getTime()
      );

      setPickupRequests(sortedRequests);
    } catch (error) {
      console.error('Error fetching pickup requests', error);
    } finally {
      setLoading(false);
    }
  };

  const groupRequestsByDate = () => {
    return pickupRequests.reduce((groups: {[key: string]: PickupRequest[]}, request) => {
      const date = new Date(request.request_date).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(request);
      return groups;
    }, {});
  };

  const toggleRequestSelection = (id: number, status: string) => {
    if (status === 'Picked up') return; // Disable selection for picked up requests
    const newSelected = new Set(selectedRequests);
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
    setSelectedRequests(newSelected);
  };

  const toggleDateSelection = (date: string) => {
    const dateRequests = groupRequestsByDate()[date].filter(
      req => req.request_status !== 'Picked up'
    );
    const dateIds = dateRequests.map(req => req.pickup_request_id);
    const allSelected = dateIds.every(id => selectedRequests.has(id));
    
    const newSelected = new Set(selectedRequests);
    dateIds.forEach(id => allSelected ? newSelected.delete(id) : newSelected.add(id));
    setSelectedRequests(newSelected);
  };

  const toggleSelectAll = () => {
    const allPendingIds = pickupRequests
      .filter(req => req.request_status !== 'Picked up')
      .map(req => req.pickup_request_id);
    
    const allSelected = allPendingIds.every(id => selectedRequests.has(id));
    setSelectedRequests(allSelected ? new Set() : new Set(allPendingIds));
  };

  const markSelectedAsPickedUp = async () => {
    if (selectedRequests.size === 0) return;
    
    setBulkLoading(true);
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const promises = Array.from(selectedRequests).map(id => 
        axios.patch(`${API_BASEURL}/pickuprequest/${id}/complete/`, {}, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
      );
      
      await Promise.all(promises);
      alert(`${selectedRequests.size} request(s) marked as picked up!`);
      setSelectedRequests(new Set());
      fetchPickupRequests();
    } catch (error) {
      console.error('Error marking pickups', error);
      alert('Some requests could not be updated');
    } finally {
      setBulkLoading(false);
    }
  };

  const Checkbox = ({ checked, status }: { checked: boolean; status: string }) => (
    status !== 'Picked up' && (
      <View style={[styles.checkbox, checked && styles.checkedBox]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
    )
  );

  const groupedRequests = groupRequestsByDate();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Pickup Status' }} />

      {loading ? (
        <ActivityIndicator size="large" color="#2B4B40" style={{ marginTop: 30 }} />
      ) : pickupRequests.length === 0 ? (
        <Text style={styles.emptyText}>No pickup requests found.</Text>
      ) : (
        <>
          <View style={styles.headerRow}>
            <TouchableOpacity 
              onPress={toggleSelectAll}
              style={styles.selectAllButton}
              disabled={pickupRequests.every(req => req.request_status === 'Picked up')}
            >
              <Checkbox 
                checked={selectedRequests.size > 0 && 
                  pickupRequests.filter(req => req.request_status !== 'Picked up')
                    .every(req => selectedRequests.has(req.pickup_request_id))}
                status="Pending"
              />
              <Text style={styles.selectAllText}>Select All Pending</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {Object.entries(groupedRequests).map(([date, requests]) => (
              <View key={date}>
                {requests.some(req => req.request_status !== 'Picked up') && (
                  <TouchableOpacity 
                    style={styles.dateHeader}
                    onPress={() => toggleDateSelection(date)}
                  >
                    <Checkbox
                      checked={requests
                        .filter(req => req.request_status !== 'Picked up')
                        .every(req => selectedRequests.has(req.pickup_request_id))}
                      status="Pending"
                    />
                    <Text style={styles.dateText}>{date}</Text>
                  </TouchableOpacity>
                )}

                {requests.map((item) => (
                  <TouchableOpacity
                    key={item.pickup_request_id}
                    onPress={() => toggleRequestSelection(item.pickup_request_id, item.request_status)}
                    activeOpacity={item.request_status === 'Picked up' ? 1 : 0.7}
                  >
                    <View style={styles.requestBox}>
                      <View style={styles.row}>
                        <Checkbox 
                          checked={selectedRequests.has(item.pickup_request_id)} 
                          status={item.request_status}
                        />
                        <View style={styles.requestInfo}>
                          <Text style={styles.title}>Pickup No.{item.pickup_request_id}</Text>
                          <Text style={[styles.status, 
                            item.request_status === 'Picked up' ? styles.pickedUp : styles.pending]}>
                            {item.request_status}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.details}>
                        <Text style={styles.label}>Weight: 
                          <Text style={styles.value}> {item.weight} {item.weight_metric}</Text>
                        </Text>
                        <Text style={styles.label}>Waste Type: 
                          <Text style={styles.value}> {item.waste_type}</Text>
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>

          {selectedRequests.size > 0 && (
            <TouchableOpacity 
              style={styles.floatingButton}
              onPress={markSelectedAsPickedUp}
              disabled={bulkLoading}
            >
              {bulkLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.floatingButtonText}>
                  Mark Selected ({selectedRequests.size})
                </Text>
              )}
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerRow: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  selectAllText: {
    marginLeft: 8,
    color: '#2B4B40',
    fontWeight: '500',
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3e3e3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  dateText: {
    marginLeft: 8,
    fontWeight: '600',
    color: '#2B4B40',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestInfo: {
    marginLeft: 8,
    flex: 1,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  pending: {
    color: '#FF6B6B',
  },
  pickedUp: {
    color: '#2B4B40',
  },
  details: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  requestBox: {
    backgroundColor: '#F8F9F9',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2B4B40',
    marginLeft: 8,
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
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#2B4B40',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#2B4B40',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#2B4B40',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },

});

export default MarkPickupPage;
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASEURL } from './authDisplayService';
import { Stack } from 'expo-router';
import { getUserProfile } from './services/authDisplayProfile';
import Icon from 'react-native-vector-icons/FontAwesome';  // Import FontAwesome icons

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

    // Get the style based on the request status
    const getStatusStyle = (status: string) => {
        if (status === 'Pending') {
            return styles.pendingText;
        } else if (status === 'Picked up') {
            return styles.pickedUpText;
        }
        return styles.defaultText;
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
                            <View style={styles.requestRow}>
                                <Icon name="calendar" size={22} color="#2B4B40" />
                                <Text style={styles.requestText}>Date: {item.request_date}</Text>
                            </View>
                            <View style={styles.requestRow}>
                                <Icon name="balance-scale" size={22} color="#2B4B40" />
                                <Text style={styles.requestText}>Weight: {item.weight} {item.weight_metric}</Text>
                            </View>
                            <View style={styles.requestRow}>
                                <Icon name="trash" size={22} color="#2B4B40" />
                                <Text style={styles.requestText}>Waste Type: {item.waste_type}</Text>
                            </View>
                            <View style={styles.requestRow}>
                                <Icon name="map-marker" size={22} color="#2B4B40" />
                                <Text style={styles.requestText}>Location: {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</Text>
                            </View>
                            <View style={styles.statusBox}>
                                {item.request_status === 'Pending' ? (
                                    <Icon name="hourglass-half" size={22} color="#721C24" />
                                ) : item.request_status === 'Picked up' ? (
                                    <Icon name="check-circle" size={22} color="#155724" />
                                ) : null}
                                <Text style={[styles.statusText, getStatusStyle(item.request_status)]}>
                                    {item.request_status}
                                </Text>
                            </View>
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
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    heading: {
        fontSize: 26,
        fontWeight: '700',
        color: '#2B4B40',
        textAlign: 'center',
        marginBottom: 20,
    },
    requestBox: {
        backgroundColor: '#F8F9F9',
        padding: 16,
        marginVertical: 10,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
    },
    requestRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    requestText: {
        fontSize: 16,
        color: '#2B4B40',
        marginLeft: 12,
    },
    statusBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    statusText: {
        fontSize: 16,
        fontWeight: '600',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginLeft: 10,
    },
    noData: {
        textAlign: 'center',
        fontSize: 16,
        color: '#999',
        marginTop: 20,
    },
    // Status-specific text styles
    pendingText: {
        backgroundColor: '#F8D7DA',
        color: '#721C24',
    },
    pickedUpText: {
        backgroundColor: '#D4EDDA',
        color: '#155724',
    },
    defaultText: {
        backgroundColor: '#E2E3E5',
        color: '#6C757D',
    },
});

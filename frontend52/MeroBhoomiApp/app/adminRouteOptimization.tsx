import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import axios from 'axios';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { OPEN_CAGE_API_KEY } from '@/constants/openCageApi';
import { API_BASEURL } from './authDisplayService';

interface Coordinate {
  lat: number;
  lng: number;
}

interface LocationInfo {
  formatted: string;
  lat: number;
  lng: number;
}

const AdminRouteOptimization = () => {
  const [locations, setLocations] = useState<LocationInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());

  const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      mode: 'date',
      is24Hour: true,
      onChange: (_, selectedDate) => {
        if (selectedDate) {
          setDate(selectedDate);
        }
      },
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setLocations([]);

      const res = await axios.get(`${API_BASEURL}/optimized-route/${formattedDate}/`);

      const coordinates: Coordinate[] = res.data.optimized_route.map(
        (item: [number, number]) => ({
          lat: item[0],
          lng: item[1],
        })
      );

      const uniqueCoords = Array.from(
        new Set(coordinates.map((coord) => `${coord.lat},${coord.lng}`))
      ).map((str) => {
        const [lat, lng] = str.split(',').map(Number);
        return { lat, lng };
      });

      const resolvedLocations: LocationInfo[] = [];
      for (const { lat, lng } of uniqueCoords) {
        try {
          const geoRes = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
            params: {
              q: `${lat},${lng}`,
              key: OPEN_CAGE_API_KEY,
            },
          });

          if (geoRes.data.results?.length > 0) {
            resolvedLocations.push({
              formatted: geoRes.data.results[0].formatted,
              lat,
              lng,
            });
          } else {
            resolvedLocations.push({
              formatted: `Location at ${lat}, ${lng}`,
              lat,
              lng,
            });
          }
        } catch {
          resolvedLocations.push({
            formatted: `Coordinates: ${lat}, ${lng}`,
            lat,
            lng,
          });
        }
      }

      setLocations(resolvedLocations);
    } catch (err) {
      setError('No data available');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [formattedDate]);

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Waste Pickup Route</Text>

      <Text style={styles.boxlabel}>Select Date</Text>
      <Pressable onPress={showDatePicker}>
        <TextInput
          style={styles.input}
          value={formattedDate}
          editable={false}
          placeholder="YYYY-MM-DD"
        />
      </Pressable>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading route...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}> {error}</Text>
        </View>
      ) : (
        <FlatList
          data={locations}
          keyExtractor={(item, index) => `${item.lat}-${item.lng}-${index}`}
          renderItem={({ item, index }) => (
            <View style={styles.locationCard}>
              <Text style={styles.stopNumber}>Stop {index + 1}:</Text>
              <Text style={styles.address}>{item.formatted}</Text>
              <Text style={styles.coordinates}>
                Coordinates: {item.lat.toFixed(6)}, {item.lng.toFixed(6)}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 16,
    backgroundColor: '#F9F9F9',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  boxlabel: {
    fontSize: 16,
    color: '#9D9D9D',
    marginBottom: 4,
    marginLeft: 4,
  },
  input: {
    width: '100%',
    padding: 14,
    borderRadius: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E8F1EE',
    backgroundColor: '#E8F1EE',
    fontSize: 16,
  },
  locationCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  stopNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  address: {
    fontSize: 14,
    color: '#333',
  },
  coordinates: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default AdminRouteOptimization;

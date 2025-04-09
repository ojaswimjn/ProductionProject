import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function LocationMap() {
  const router = useRouter();

  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      setMapRegion(prev => ({
        ...prev,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));
    })();
  }, []);

  const handleConfirm = () => {
    // Send data back to scheduleWaste.tsx via route params
    router.replace({
      pathname: '/scheduleWaste',
      params: {
        latitude: mapRegion.latitude.toString(),
        longitude: mapRegion.longitude.toString(),
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={region => setMapRegion(region)}
      >
        <Marker
          coordinate={mapRegion}
          draggable
          onDragEnd={e => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            setMapRegion(prev => ({
              ...prev,
              latitude,
              longitude,
            }));
          }}
        />
      </MapView>
      <Button title="Confirm Location" onPress={handleConfirm} />
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

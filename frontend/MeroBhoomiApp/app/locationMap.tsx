import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { View, Button, Alert, StyleSheet, TextInput } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

export default function LocationMap() {
  const router = useRouter();

  // Define the state types
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{ latitude: number, longitude: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const region: Region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setInitialRegion(region);
      setMarkerPosition({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const handleConfirm = () => {
    if (!markerPosition) {
      Alert.alert("Please select a location.");
      return;
    }

    router.replace({
      pathname: "/scheduleWaste",
      params: {
        latitude: markerPosition.latitude.toString(),
        longitude: markerPosition.longitude.toString(),
      },
    });
  };

  const handleRecenter = async () => {
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    setMarkerPosition({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setInitialRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      Alert.alert("Please enter a location to search.");
      return;
    }

    const apiKey = "712c96789ea74403a35a42a728f96dd5"; // Replace with your OpenCage API key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${searchQuery}&key=${apiKey}&language=en&pretty=1`;

    try {
      const response = await axios.get(url);
      const results = response.data.results;

      if (results.length > 0) {
        const { geometry, formatted } = results[0];
        const region: Region = {
          latitude: geometry.lat,
          longitude: geometry.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setInitialRegion(region);
        setMarkerPosition({
          latitude: geometry.lat,
          longitude: geometry.lng,
        });
      } else {
        Alert.alert("No results found.");
      }
    } catch (error) {
      console.error("Error searching location:", error);
      Alert.alert("Error", "Failed to search location.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {initialRegion && markerPosition && (
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
        >
          <Marker
            coordinate={markerPosition}
            draggable
            onDragEnd={(e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setMarkerPosition({ latitude, longitude });
            }}
          />
        </MapView>
      )}

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for a location"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Confirm Location" onPress={handleConfirm} />
        <Button title="Recenter" onPress={handleRecenter} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  searchContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

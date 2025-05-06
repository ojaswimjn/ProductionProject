import React, { useState, useEffect } from "react";
import { View, Alert, Text, StyleSheet, Linking, ActivityIndicator } from "react-native";
import * as Location from "expo-location";

export default function RecyclerMap() {
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission to access location was denied");
          setIsLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        const { latitude, longitude } = location.coords;
        openGoogleMaps(latitude, longitude);
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert("Error", "Failed to fetch location.");
        setIsLoading(false);
      }
    })();
  }, []);

  const openGoogleMaps = (latitude: number, longitude: number) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=recyclers+near+${latitude},${longitude}`;
    Linking.openURL(googleMapsUrl)
      .then(() => setIsLoading(false))
      .catch((err) => {
        console.error("Error opening URL: ", err);
        Alert.alert("Error", "Failed to open Google Maps.");
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.text}>Finding nearby recyclers...</Text>
        </>
      ) : (
        <Text style={styles.text}>Something went wrong or you denied permission.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: "#555",
  },
});

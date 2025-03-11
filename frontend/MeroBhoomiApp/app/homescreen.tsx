import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { getUserProfile } from "../app/services/authDisplayProfile"; // Import the function for fetching user profile

const HomeScreen = () => {
  const [userProfile, setUserProfile] = useState<any>(null); // Store the fetched user profile
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading spinner

  // Function to fetch user profile
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile(); // Call the API to get user profile data
      setUserProfile(data); // Set the fetched data to state
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to fetch user profile.");
      console.error("Error fetching user profile:", error);
    }
  };

  // Fetch the profile when the component mounts
  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2B4B40" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.container}>
        <Text>No profile data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your Home Page</Text>
      <Text style={styles.profileInfo}>Email: {userProfile.email}</Text>
      <Text style={styles.profileInfo}>Name: {userProfile.name}</Text>
      {/* Add other user profile details as necessary */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileInfo: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default HomeScreen;

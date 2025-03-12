import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { getUserProfile } from "./services/authDisplayProfile"; // Assuming this is where your getUserProfile function is defined

// Define the UserProfile interface
interface UserProfile {
  full_name: string;
  email: string;
  user_role: string;
  is_active: boolean;
  // Add other fields if needed
}

const HomeScreen = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null); // State typed as UserProfile or null
  const [loading, setLoading] = useState(true);  // To handle loading state

  useEffect(() => {
    // Fetch user profile once the component mounts
    const fetchUserProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setUserProfile(profileData);  // Save the fetched data in state
        setLoading(false);  // Turn off loading indicator
      } catch (error) {
        setLoading(false);  // Turn off loading if there's an error
        Alert.alert("Error", "Failed to fetch user profile.");
      }
    };

    fetchUserProfile();  // Call the function to fetch the profile
  }, []);

  if (loading) {
    // While loading, show a spinner or loading text
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2B4B40" />
        <Text>Loading your profile...</Text>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.container}>
        <Text>No profile data found. Please log in again.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome {userProfile.full_name}!</Text>
      <Text>Email: {userProfile.email}</Text>
      <Text>Role: {userProfile.user_role}</Text>
      <Text>Status: {userProfile.is_active ? "Active" : "Inactive"}</Text>
      {/* Render other user profile details if needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default HomeScreen;

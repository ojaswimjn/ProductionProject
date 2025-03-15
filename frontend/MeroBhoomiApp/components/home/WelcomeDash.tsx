import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground,ActivityIndicator, Alert,   Dimensions,
} from "react-native";
import { getUserProfile } from "../../app/services/authDisplayProfile" 

// Define the UserProfile interface
interface UserProfile {
  full_name: string;
  email: string;
  user_role: string;
  is_active: boolean;
  // Add other fields if needed
}

export const { width, height } = Dimensions.get("window"); // Get the screen dimensions

const WelcomeDash = () => {
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
      <ImageBackground source={require("../../assets/images/profile-bg.png")} style={styles.profileBox}>
        <Text style={styles.title}>Welcome {userProfile.full_name}!</Text>
        <Text style={styles.profileText}>Email: {userProfile.email}</Text>
        <Text style={styles.profileText}>Role: {userProfile.user_role}</Text>
        <Text style={styles.profileText}>Status: {userProfile.is_active ? "Active" : "Inactive"}</Text>
        </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: '2%',
    marginBottom: -60

    // backgroundColor: "#ffffff",
  },
  profileBox: {
    width: width * 0.9,
    height: 200,
    justifyContent: "center",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#ffffff",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  profileText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#ffffff",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});


export default WelcomeDash;

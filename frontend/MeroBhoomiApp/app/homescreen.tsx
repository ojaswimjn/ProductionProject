import React, {useEffect, useState}from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { getUserProfile } from './services/authDisplayProfile';

interface UserProfile {
  email: string;
  full_name: string;
  id: string;
  is_active: boolean;
  // Add other fields if needed
}

const homescreen = () => {
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile(); // Call the API to get user profile data
      setUserProfile(data); // Set the fetched data to state
      setLoading(false);
      console.log(data);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to fetch user profile.");
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);
  
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome {userProfile.full_name}!</Text>
      <Text>Email: {userProfile.email}</Text>
      <Text>Role: {userProfile.user_role}</Text>
      <Text>Status: {userProfile.is_active ? "Active" : "Inactive"}</Text>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
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

export default homescreen;

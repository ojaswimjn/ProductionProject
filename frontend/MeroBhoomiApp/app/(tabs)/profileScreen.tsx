import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, Alert,ScrollView, ActivityIndicator, Image , TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASEURL } from "../authDisplayService";
import { getUserProfile } from "../services/authDisplayProfile"
import ChangePassword from "../profile/ChangePassword"
import SavedAddress from "../profile/SavedAddress"
import PointsAndReedemption from "../profile/PointsAndReedemption"
import Logout from "../profile/Logout"
// import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";

import {  useRouter } from "expo-router";



const ProfileScreen = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    loadUserProfile();
  }, []);

  // Fetch user profile using the auth service function
  const loadUserProfile = async () => {
    try {
      const profileData = await getUserProfile();
      console.log(profileData);
      setUserProfile(profileData);
    } catch (error) {
      Alert.alert("Error", "Could not load profile.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#2B4B40" />
      ) : (
        <>

          <View style={styles.banner}>
            <Image source={require("../../assets/images/profileBanner.png")} style={styles.bannerImage} />
          </View>

          <View style={styles.profileContainer}>
            <Image source={require("../")} style={styles.profileImage} />
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{userProfile?.full_name || "N/A"}</Text>

            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{userProfile?.email || "N/A"}</Text>

            <Text style={styles.label}>Date Of Birth:</Text>
            <Text style={styles.value}>{userProfile?.date_of_birth || "N/A"}</Text>

          </View>
          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => router.push('/profile/ChangePassword')
            }
            >
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.button} 
              onPress={() => router.push('/profile/SavedAddress')}
            >
              <Text style={styles.buttonText}>Saved Addresses</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.button} 
              onPress={() => router.push('/profile/PointsAndReedemption')}
            >
              <Text style={styles.buttonText}>Points & Redemption</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.button]} 
              onPress={() => router.push('/profile/Logout')}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>     
        </>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
  },
  banner: {
    width: "100%",
    height: 150,
    marginBottom: 20,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 10,
  },
  profileContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2B4B40",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#2B4B40",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    width: "90%",
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#B22222",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;

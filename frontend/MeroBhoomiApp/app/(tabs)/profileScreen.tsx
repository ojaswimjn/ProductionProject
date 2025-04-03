import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Alert,ScrollView, ActivityIndicator, Image , TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASEURL } from "../authDisplayService";
import { getUserProfile } from "../services/authDisplayProfile"
import ChangePassword from "../profile/ChangePassword"
import SavedAddress from "../profile/SavedAddress"
import PointsAndReedemption from "../profile/PointsAndReedemption"
import Logout from "../profile/Logout"
// import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";
import { Ionicons } from "@expo/vector-icons";
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
            <Image source={require("../../assets/images/block.jpg")} style={styles.bannerImage} />
          </View>

          <View style={styles.profileContainer}>
            <Image source={require("../../assets/images/user.png")} style={styles.profileImage} />
            <Text style={styles.name}>{userProfile?.full_name || "Name: Loading..."}</Text>

            <Text style={styles.email}>{userProfile?.email || "Email: Loading..."}</Text>

            <Text style={styles.dob}>{userProfile?.date_of_birth || "DOB: No data found"}</Text>

          </View>
          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => router.push('/profile/ChangePassword')
            }
            >
              <Text style={styles.buttonText}>Change Password</Text>
              <Ionicons name="chevron-forward" size={20} color="#ffffff" />

            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.button} 
              onPress={() => router.push('/profile/SavedAddress')}
            >
              <Text style={styles.buttonText}>Saved Addresses</Text>
              <Ionicons name="chevron-forward" size={20} color="#ffffff" />

            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.button} 
              onPress={() => router.push('/profile/PointsAndReedemption')}
            >
              <Text style={styles.buttonText}>Points & Redemption</Text>
              <Ionicons name="chevron-forward" size={20} color="#ffffff" />

            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.button]} 
              onPress={() => router.push('/profile/Logout')}
            >
              <Text style={styles.buttonText}>Logout</Text>
              <Ionicons name="chevron-forward" size={20} color="#ffffff" />

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
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  banner: {
    width:'100%',
    height: 220,
    backgroundColor: "#2B4B40",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 90,
    borderBottomRightRadius: '5%',
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: -50,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: "gray",
  },
  dob: {
    fontSize: 16,
    color: "gray",
  },
  buttonContainer: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#2B4B40",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    width: "90%",
    alignItems: "center",
    justifyContent: "space-between",
    // transition: "background-color 0.2s ease-in-out",
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

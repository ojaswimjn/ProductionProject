import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Alert,ScrollView, ActivityIndicator, Image , TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASEURL } from "../authDisplayService";
import { getUserProfile } from "../services/authDisplayProfile"
import ChangePassword from "../profile/ChangePassword"
// import SavedAddress from "../profile/SavedAddress"
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

  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    const initials = nameParts
      .map((part: string) => part.charAt(0).toUpperCase())
      .join("");
    return initials;
  };


  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#2B4B40" />
      ) : (
        <>

          <View style={styles.banner}>
            {/* <Image source={require("../../assets/images/block.jpg")} /> */}
          </View>

          <View style={styles.profileContainer}>
            {/* <Image source={require("../../assets/images/user.png")} style={styles.profileImage} /> */}
            {/* Circle with initials */}
            <View style={styles.profileImage}>
              <Text style={styles.initials}>
                {userProfile?.full_name ? getInitials(userProfile.full_name) : "NN"}
              </Text>
            </View>
            <Text style={styles.name}>{userProfile?.full_name || "Name: Loading..."}</Text>

            <Text style={styles.email}>{userProfile?.email || "Email: Loading..."}</Text>

            <Text style={styles.dob}>{userProfile?.date_of_birth || "DOB: No data found"}</Text>

          </View>
          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
          <TouchableOpacity 
              style={styles.button} 
              onPress={() => router.push('/profile/EditProfile')
            }
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={20} color="#ffffff" />

            </TouchableOpacity>
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
              onPress={() => router.push('/locationMap')}
            >
              <Text style={styles.buttonText}>Your location</Text>
              <Ionicons name="chevron-forward" size={20} color="#ffffff" />

            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.button} 
              onPress={() => router.push('/pointsReedemptionScreen')}
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
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  banner: {
    width: '100%',
    height: 190,
    backgroundColor: "#D3E3DD",
    justifyContent: "center",
    alignItems: "center",
    // borderBottomLeftRadius: 35,
    // borderBottomRightRadius: 35,
    marginBottom: 30,
  },
  profileContainer: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginTop: -110,
    elevation: 5,
    shadowColor: "#9E9E9E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: "85%",
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#2B4B40",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "#ffffff",
    elevation: 3,
  },
  initials: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#E8F1EE",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 5,
    color: "#2B4B40",
  },
  email: {
    fontSize: 15,
    color: "#5f5f5f",
    marginTop: 4,
  },
  dob: {
    fontSize: 15,
    color: "#5f5f5f",
    marginTop: 2,
  },
  buttonContainer: {
    marginTop: 40,
    width: "90%",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#2B4B40",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
  },
  logoutButton: {
    backgroundColor: "#B22222",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});


export default ProfileScreen;

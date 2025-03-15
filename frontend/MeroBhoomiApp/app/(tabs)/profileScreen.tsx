import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator  } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASEURL } from "../authDisplayService";
import { getUserProfile } from "../services/authDisplayProfile"


const ProfileScreen = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingPassword, setEditingPassword] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    loadUserProfile();
  }, []);

  // Fetch user profile using the auth service function
  const loadUserProfile = async () => {
    try {
      const profileData = await getUserProfile();
      setUserProfile(profileData);
    } catch (error) {
      Alert.alert("Error", "Could not load profile.");
    } finally {
      setLoading(false);
    }
  };

 // Change Password Function
  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirmation do not match!");
      return;
    }

    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (!accessToken) {
        Alert.alert("Error", "No authentication token found. Please log in again.");
        return;
      }

      const requestData = {
        old_password: currentPassword,
        new_password: newPassword,
        new_password2: confirmPassword, // Ensure these match API expectations
      };
  
      console.log("Sending request with data:", requestData); // Debugging
  
      const response = await axios.post(
        `${API_BASEURL}/user/changepassword/`,
        requestData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      console.log("Response:", response.data);

      if (response.status === 200) {
        Alert.alert("Success", "Password changed successfully!");
        setEditingPassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        Alert.alert("Error", response.data?.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };
  return (
    <View style={styles.container}>
    {loading ? (
      <ActivityIndicator size="large" color="#2B4B40" />
    ) : (
      <>
        {/* Profile Information */}
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{userProfile?.name || "N/A"}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userProfile?.email || "N/A"}</Text>

        {!editingPassword ? (
          <Button title="Change Password" onPress={() => setEditingPassword(true)} />
        ) : (
          <>
            {/* Password Change Form */}
            <Text style={styles.title}>Change Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />

            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <Button title="Submit" onPress={changePassword} />
            <Button title="Cancel" onPress={() => setEditingPassword(false)} color="red" />
          </>
        )}
      </>
    )}
  </View>
);
};

// Styles
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
  marginBottom: 20,
},
label: {
  fontSize: 18,
  fontWeight: "600",
  marginTop: 10,
},
value: {
  fontSize: 16,
  marginBottom: 10,
},
input: {
  width: "100%",
  padding: 10,
  marginBottom: 15,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 5,
},
});

export default ProfileScreen;

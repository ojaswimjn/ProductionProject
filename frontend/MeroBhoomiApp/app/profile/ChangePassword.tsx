import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASEURL } from "../authDisplayService";
import { getUserProfile } from "../services/authDisplayProfile";

const DisplayProfile = () => {
  const [editingPassword, setEditingPassword] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Change Password Function
  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirmation do not match!");
      return;
    }

    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (!accessToken) {
        Alert.alert(
          "Error",
          "No authentication token found. Please log in again."
        );
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

      if (response.status === 201) {
        Alert.alert("Success", "Password changed successfully!");
        setEditingPassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        Alert.alert(
          "Error",
          response.data?.message || "Failed to change password"
        );
      }
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
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
      <Button
        title="Cancel"
        onPress={() => setEditingPassword(false)}
        color="red"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {},
  input: {},
});

export default DisplayProfile;

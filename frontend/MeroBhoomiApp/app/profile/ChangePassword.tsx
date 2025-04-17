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
import {  useRouter } from "expo-router";


const ChangePassword = () => {
  const [editingPassword, setEditingPassword] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const isValidPassword = (password: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{6,}$/;
    return regex.test(password);
  };


  // Change Password Function
  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirmation do not match!");
      return;
    }

    if (!isValidPassword(newPassword)) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 6 characters and include at least 1 letter, 1 number, and 1 special character."
      );
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

        router.push('/login')
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

      <Button title="Submit" onPress={changePassword} color="#2B4B40" />
      <Button
        title="Cancel"
        onPress={() => setEditingPassword(false)}
        color="#B22222"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#2B4B40",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
});

export default ChangePassword;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASEURL } from "../authDisplayService";
import { useRouter } from "expo-router";
import { Stack } from 'expo-router';


const { width, height } = Dimensions.get("window");

const ChangePassword = () => {
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const isValidPassword = (password: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{6,}$/;
    return regex.test(password);
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Missing Fields", "Please fill in all password fields.");
      return;
    }

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
        new_password2: confirmPassword,
      };

      setLoading(true);
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

      if (response.status === 201) {
        Alert.alert("Success", "Password changed successfully!");
        setEditingPassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        router.push("/login");
      } else {
        Alert.alert("Error", response.data?.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <Text style={styles.header}>Change Password</Text>

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

        <TouchableOpacity
          style={styles.submitButton}
          onPress={changePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => 
            // setEditingPassword(false)
            router.push("/profileScreen")

          }
          >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: width * 0.08,
  },
  header: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: "#2B4B40",
    textAlign: "center",
    marginBottom: height * 0.05,
  },
  input: {
    width: "100%",
    padding: width * 0.04,
    borderRadius: 16,
    marginVertical: height * 0.01,
    borderWidth: 1,
    borderColor: "#E8F1EE",
    backgroundColor: "#E8F1EE",
    fontSize: width * 0.04,
  },
  submitButton: {
    width: "100%",
    backgroundColor: "#2B4B40",
    padding: height * 0.016,
    borderRadius: 30,
    alignItems: "center",
    marginTop: height * 0.02,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    alignItems: "center",
    marginTop: height * 0.03,
  },
  cancelButtonText: {
    color: "#B22222",
    fontSize: width * 0.04,
    fontWeight: "600",
  },
});

export default ChangePassword;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import authDisplayService from "./authDisplayService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {  useRouter } from "expo-router";
const { width, height } = Dimensions.get("window"); // Get the screen dimensions

const router = useRouter();

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async () => {
    console.log("Attempting login with:", { email, password });
    try {
      const tokens = await authDisplayService.userLogin(email, password);
      if (tokens?.access && tokens?.refresh) {
        // Save tokens to AsyncStorage
        await AsyncStorage.setItem("accessToken", tokens.access);
        await AsyncStorage.setItem("refreshToken", tokens.refresh);
        console.log("Access Token:", tokens.access);
        console.log("Refresh Token:", tokens.refresh);
        Alert.alert("Success", "Logged in successfully!");

        // router.push("./homescreen");
        router.push("./(tabs)");
      } else {
        Alert.alert("Error", "Failed to log in: No token received.");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
      console.error("Login failed:", error.response?.data || error.message);
    }
  };
  return (
    
    <View style={styles.loginContainer}>
      <Text style={styles.title}>Welcome Back!</Text>
      <TextInput
        style={styles.TextInput}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoFocus={true} // Ensure it focuses and shows keyboard on email input
      />
      <TextInput
        style={styles.TextInput}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.signupText}>Don't have an account?</Text>
      <TouchableOpacity style={styles.signupTextContainer}
      onPress={() => router.push('./signup')}>
        <Text style={styles.signupText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: width * 0.08, // 8% of screen width for title size
    fontWeight: "bold",
    paddingBottom: height * 0.05, // 5% of the height fo spacing
    color: "#333",
  },
  TextInput: {
    width: "80%",
    padding: width * 0.04,
    borderRadius: 8,
    marginVertical: height * 0.01,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    fontSize: width * 0.04, // Responsive font size based on screen width
  },
  loginButton: {
    width: "80%",
    backgroundColor: "#2B4B40", // Green
    padding: height * 0.02, // 2% of screen height for padding
    borderRadius: 8,
    alignItems: "center",
    marginVertical: height * 0.03, // 3% of screen height for spacing
  },
  loginButtonText: {
    color: "#fff",
    fontSize: width * 0.05, // 5% of screen width for font size
    fontWeight: "600",
  },
  signupTextContainer: {
    marginTop: height * 0.01, // 2% of screen height for spacing
  },
  signupText: {
    color: "#007BFF",
    fontSize: width * 0.04, // Responsive font size based on screen width
  },
});
export default LoginScreen;

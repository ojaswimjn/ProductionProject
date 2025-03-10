
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Simulate login process
    // setTimeout(() => {
    //   setIsLoading(false);
    //   router.replace("/(tabs)");
    // }, 1500);
  };

//   const goToSignUp = () => {
//     router.push("/authentication/signup");
//   };

//   const goToForgotPassword = () => {
//     router.push("/authentication/forgot-password");
//   };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>HormonIQ</Text>
        <Text style={styles.headerSubtitle}>Balance your hormones.</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#CCC"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#CCC"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={goToForgotPassword}
        > */}
          {/* <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={[styles.loginButton, (!email || !password) && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={!email || !password || isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? "Logging in..." : "Log In"}
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        {/* <TouchableOpacity style={styles.signupButton} onPress={goToSignUp}>
          <Text style={styles.signupButtonText}>Create an Account</Text>
        </TouchableOpacity> */}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4B0082", // Matching indigo theme
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    marginTop: 5,
    fontStyle: "italic",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#5D1A9D", // Slightly lighter indigo for form area
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6E29B5", // Even lighter indigo for input fields
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 15,
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    height: "100%",
  },
  eyeIcon: {
    padding: 5,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: "#E0C2FF", // Light purple
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#8A2BE2", // Vibrant purple for button
    borderRadius: 10,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#8A2BE2",
  },
  dividerText: {
    color: "#FFFFFF",
    marginHorizontal: 10,
    fontSize: 14,
  },
  signupButton: {
    borderWidth: 1,
    borderColor: "#8A2BE2",
    borderRadius: 10,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  signupButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
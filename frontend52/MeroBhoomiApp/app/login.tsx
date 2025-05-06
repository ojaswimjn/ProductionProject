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
  Image,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import authDisplayService from "./authDisplayService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
// import { Icon } from "react-native-vector-icons";
// import {eyeOff} from 'react-native-vector-icons';
// import {eye} from 'react-icons-kit/feather/eye'

const { width, height } = Dimensions.get("window"); // Get the screen dimensions

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState('password');
  // const [ icon, setIcon] = useState(eyeOff);
  
  const handleLogin = async () => {
    console.log("Attempting login with:", { email, password });

    if(!email && !password){
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    if(!email){
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    if(!password){
      Alert.alert("Error", "Please enter your password.");
    }



    try {
      const tokens = await authDisplayService.userLogin(email, password);
      if (tokens?.access && tokens?.refresh) {
        // Save tokens to AsyncStorage
        await AsyncStorage.setItem("accessToken", tokens.access);
        await AsyncStorage.setItem("refreshToken", tokens.refresh);
        console.log("Access Token:", tokens.access);
        console.log("Refresh Token:", tokens.refresh);
        Alert.alert("Success", "Logged in successfully!");

        router.push("./(tabs)");
      } else {
        Alert.alert("Error", "Failed to log in: No token received.");
      }
    } catch (error: any) {
      
      // Alert.alert("Error", error?.response?.data?.errors?.non_field_errors?.[0] || error?.message);
      Alert.alert("Error", "The email or password you have entered is incorrect. Please try again.");
      console.log("Login failed:", error.response?.data || error.message);
    }
  };

  // const handleToggle=() =>{
  //   if(type === 'password'){
  //     setIcon(eye);
  //     setType('text');
  //   }
  //   else{
  //     setIcon(eyeOff);
  //     setType('password');
  //   }
  // }
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={[styles.loginContainer, { flexGrow: 1 }]}>
        <Image source={require("../assets/images/login.png")} style={styles.imageContainer} />
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.motto}>Login to your account</Text>
        </View>

        <View style={styles.inputContainer}>
          {/* <Icon name="email" size={24} color="#333" style={styles.icon} /> */}
          <TextInput
            style={styles.TextInput}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {/* <TouchableOpacity onPress={handleToggle}>
            <Icon icon={icon}>hi</Icon>
          </TouchableOpacity> */}

          
          <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => {router.push("./forgetPassword")}}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push("./signup")}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  imageContainer: {
    width: "100%",
    height: height * 0.4, // Covers top 40% of the screen
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  titleContainer: {
    alignItems: "center",
    marginTop: height * 0.45, // Adjust based on image height
  },
  title: {
    fontSize: width * 0.08, // 8% of screen width for title size
    fontWeight: "bold",
    color: "#2B4B40",
  },
  motto: {
    fontSize: width * 0.028, // Slightly smaller than title
    color: "#2B4B40",
    fontWeight: "400",
    marginBottom: height * 0.03,
  },
  inputContainer: {
    width: "80%",
    
  },
  TextInput: {
    width: "100%",
    padding: width * 0.04,
    borderRadius: 16,
    marginVertical: height * 0.01,
    borderWidth: 1,
    borderColor: "#E8F1EE",
    backgroundColor: "#E8F1EE",
    fontSize: width * 0.04,
  },
  forgotPasswordContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: height * 0.005,
  },
  forgotPasswordText: {
    color: "#2B4B40",
    fontSize: width * 0.035,
    fontWeight: "500",
    marginBottom: height * 0.13,
  },
  loginButton: {
    width: "80%",
    backgroundColor: "#2B4B40",
    padding: height * 0.016,
    borderRadius: 30,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: width * 0.05,
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: height * 0.045, 
  },
  signupText: {
    fontSize: width * 0.04,
    color: "#9D9D9D",
  },
  signupLink: {
    color: "#2B4B40",
    fontWeight: "600",
    marginLeft: 5,
    marginTop: 3,
  },
});

export default LoginScreen;

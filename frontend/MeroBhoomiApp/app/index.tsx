import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
  } from "react-native";
  import React from "react";
  import { useRouter } from "expo-router";
  
  export default function SplashScreen() {
    const router = useRouter();
  
    // Navigate to Login
    const handleNavigate = () => {
      router.push("./login");
    };
  
    return (
      <TouchableWithoutFeedback onPress={handleNavigate} accessible={false}>
        <View style={styles.container}>
          {/* App Logo <Image source={require("../assets/logo.png")} style={styles.logo} />*/}
  
          {/* App Name */}
          <Text style={styles.appName}>Kuraकुरा</Text>
  
          {/* Slogan */}
          <Text style={styles.slogan}>Learn, Speak, Belong.</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#D32F2F",
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: 20,
    },
    appName: {
      fontSize: 30,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    slogan: {
      fontSize: 16,
      color: "#FFFFFF",
      marginTop: 5,
    },
  });
  
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
          <Image source={require('../assets/images/logo.png')} style={styles.logo} />

          {/* App Name */}
          <Text style={styles.appName}>MeroBhoomi</Text>
  
          {/* <Text style={styles.slogan}>Learn, Speak, Belong.</Text> */}
        </View>
      </TouchableWithoutFeedback>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#051C14",
    },
    logo: {
      width: '75%',
      height: '18%',
      marginBottom: 20,
      marginTop: -70
    },
    appName: {
      fontSize: 30,
      fontWeight: "bold",
      color: "#FFFFFF",
    }
    
  });
  
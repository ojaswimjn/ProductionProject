
import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Explore() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      Alert.alert("Logged Out", "You have been logged out successfully.");
      router.push('/login');
  }catch(error) {
    Alert.alert("Error","Something  went wrong while logging out.");
  }
}

 useEffect(() => {
  handleLogout();
 }, [])
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2B4B40" />
    </View>
    );
  }
   const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F4F4F4",
      },
  })


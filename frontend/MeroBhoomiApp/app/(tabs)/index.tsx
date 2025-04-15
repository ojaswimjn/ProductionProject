import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";

import GridMenu from "@/components/home/GridMenu";
import Header from "@/components/home/Header";
import WelcomeDash from "@/components/home/WelcomeDash";
import DataDashboard from "@/components/home/DataDashboard";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushTokenAndSend } from "../usePushToken";

export const { width, height } = Dimensions.get("window"); // Get the screen dimensions

const HomeScreen = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const tokenGenerator = async ( ) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      setAccessToken(token);
      if (!token) {
        console.log("token not being generated for expo push")
        return;
      }
    }catch (error) {
      console.error("Error in token generator in index:", error);
    }
  }
  useEffect(() => {
    tokenGenerator();
  }, []);

  useEffect(() => {
    console.log(" accessToken in useEffect:", accessToken);
    if (accessToken) {
      registerForPushTokenAndSend(accessToken);
    }
  }, [accessToken]);

  return (
    <View style={styles.container}>
    {/* Fixed Header */}
    <Header />

    {/* Scrollable Content */}
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <WelcomeDash />
      <GridMenu />
      <DataDashboard/>
      <GridMenu />
      <WelcomeDash />

    </ScrollView>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginTop: 45
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 20,
    marginTop: 50, // Adjust this so content does not overlap with the fixed header
  },
})


export default HomeScreen;

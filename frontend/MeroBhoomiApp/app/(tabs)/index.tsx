import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";

import GridMenu from "@/components/home/GridMenu";
import Header from "@/components/home/Header";
import WelcomeDash from "@/components/home/WelcomeDash";
import DataDashboard from "@/components/home/DataDashboard";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushNotificationsAsync, setupNotificationHandler } from "../pushNotification";


export const { width, height } = Dimensions.get("window"); // Get the screen dimensions

const HomeScreen = () => {

  // useEffect(() => {
  //   const setupNotifications = async () => {
  //     try {
  //       const accessToken = await AsyncStorage.getItem("accessToken");
  //       console.log("Access Token: ", accessToken);

  //       // If the token exists, register for push notifications
  //       if (accessToken) {
  //         await registerForPushNotificationsAsync(accessToken); // Register for push notifications
  //       } else {
  //         console.log("No access token found");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching access token: ", error);
  //     }
  //   };

  //   setupNotifications();

  //   // Set up notification handler for foreground and background
  //   setupNotificationHandler(); 

  //   // Clean-up function to remove any listeners or clean up tasks
  //   return () => {
  //     console.log("HomeScreen clean-up");
  //     // If you have any listeners or cleanup tasks, you can add them here
  //   };
  // }, []); // Empty dependency array means this effect runs only once, on mount



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

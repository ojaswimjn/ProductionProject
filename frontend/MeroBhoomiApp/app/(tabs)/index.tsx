import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";

import GridMenu from "@/components/home/GridMenu";
import Header from "@/components/home/Header";
import WelcomeDash from "@/components/home/WelcomeDash";

export const { width, height } = Dimensions.get("window"); // Get the screen dimensions

const HomeScreen = () => {

  return (
    <View style={styles.container}>
    {/* Fixed Header */}
    <Header />

    {/* Scrollable Content */}
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <WelcomeDash />
      <GridMenu />
      <WelcomeDash />
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

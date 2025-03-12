import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const _layout = () => {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
        <Tabs.Screen
          name="homescreen"
          options={{
            title: "Homescreen",
            tabBarIcon: () => <Ionicons name="home" size={24} />,
          }}
        />
  
        
        {/* <Tabs.Screen
          name="Challenges"
          options={{
            title: "Challenges",
            tabBarIcon: () => <Ionicons name="trophy" size={24} />,
          }}
        />
  
        <Tabs.Screen
          name="Profile"
          options={{
            //title: "Profile",
            tabBarIcon: () => <Ionicons name="person" size={24} />,
          }}
        /> */}
      </Tabs>
    );
  };
  
  export default _layout;
  
  const styles = StyleSheet.create({});
  
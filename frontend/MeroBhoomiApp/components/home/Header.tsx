import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Header = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MeroBhoomi</Text>
      <TouchableOpacity style={styles.iconContainer} onPress={()=> {router.push("/notificationPage") }}>
        <Icon name="bell" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute", // Keeps it fixed at the top
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    elevation: 5, // Adds a shadow on Android
    shadowColor: "#000", // Adds a shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1000, // Ensures it's above scrollable content
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2B4B40',
  },
  iconContainer: {
    marginLeft: 10, // Add some margin if needed
  },
});

export default Header;

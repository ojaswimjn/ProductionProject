import React from "react";
import { Button, View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PointsAndReedemptionScreen = () => {
  const handleSendNotification = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    await fetch("http://192.168.10.68:8000/api/send-test-push/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Send Test Notification" onPress={handleSendNotification} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // vertically center
    alignItems: "center",     // horizontally center
    padding: 16,
    backgroundColor: "#fff",  // optional clean background
  },
});

export default PointsAndReedemptionScreen;

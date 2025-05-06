import {
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { Stack } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("./login"); // navigate after 2 seconds timer
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.appName}>MeroBhoomi</Text>
      </View>
    </>
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
    marginTop: -30,
  },
  appName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF",
  }
});

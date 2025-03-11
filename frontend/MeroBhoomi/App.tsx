import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './app/screens/LoginScreen';
import { Stack } from "expo-router";


const Stack = createNativeStackNavigator();

export default function App() {
  return (

      <Stack.screenOptions>
        <Stack.Screen name="login" component={LoginScreen}></Stack.Screen>
        {/* <Stack.Screen name="home" component={LoginScreen}></Stack.Screen> */}

      
      </Stack.screenOptions>
      
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

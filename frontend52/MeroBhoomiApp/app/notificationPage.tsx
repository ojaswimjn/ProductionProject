import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

const NoNotificationsPage = () => {
  return (
    <>
        <Stack.Screen 
        options={{
          headerShown: true, 
          title: 'Notifications', 
        }} 
      />
        <View style={styles.container}>
        <Text style={styles.message}>You don't currently have important notifications.</Text>
        </View>
    </>    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center'
  },
});

export default NoNotificationsPage;

// hooks/usePushToken.js
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { API_BASEURL } from './authDisplayService';

export async function registerForPushTokenAndSend(jwtToken) {
  console.log("🔔 registerForPushTokenAndSend called",jwtToken);

  let { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    status = newStatus;
  }

  if (status !== 'granted') {
    alert('Push notification permission not granted!');
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log(token)

  // 👇 Send token to Django
  await fetch(`${API_BASEURL}/save-token/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ expo_token: token }),
  });
}

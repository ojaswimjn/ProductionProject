import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

// Send the Expo Push Token to the backend API
export async function sendPushTokenToBackend(token: string, authToken: string) {
  try {
    const response = await fetch('http://172.22.16.246:8000/api/save-push-token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`, // Pass auth token for authentication
      },
      body: JSON.stringify({ token }),
    });

    const result = await response.json();
    if (result.message === 'Push token saved successfully') {
      console.log('Push token saved to backend successfully');
    } else {
      console.error('Failed to save push token:', result);
    }
  } catch (error) {
    console.error('Error sending push token to backend:', error);
  }
}

// Register for push notifications and retrieve Expo Push Token
export async function registerForPushNotificationsAsync(authToken: string) {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (finalStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Permission for push notifications is required!');
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;

    // Send the token to the backend
    await sendPushTokenToBackend(token, authToken);
  } catch (error) {
    console.error('Error getting push token:', error);
  }
}

// Set up the notification handler (for both foreground and background)
export function setupNotificationHandler() {
  useEffect(() => {
    // Foreground notification handler
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
      // Handle notification when app is in the foreground
    });

    // Background notification handler
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
      // Handle response when app is in the background or closed
    });

    // Cleanup subscriptions on component unmount
    return () => {
      foregroundSubscription.remove();
      backgroundSubscription.remove();
    };
  }, []);
}

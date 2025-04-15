import * as Notifications from 'expo-notifications';

export async function registerForPushNotificationsAsync() {
  // Get permission to send push notifications
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

  // Get the Expo push token
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Expo Push Token: ", token);
  return token;
}

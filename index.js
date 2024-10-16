/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import messaging from '@react-native-firebase/messaging';
import {name as appName} from './app.json';

// 백그라운드 상태
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);

  const { notification } = remoteMessage;
  const fcmToken = await messaging().getToken();

  const requestBody = {
    fcmToken: fcmToken,
    title: notification?.title || 'Default Title',
    body: notification?.body || 'Default Body',
  };

  try {
    const response = await fetch('http://211.188.51.4/feign/fcm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error('Failed to send FCM message to server:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending FCM message:', error);
  }
});

AppRegistry.registerComponent(appName, () => App);

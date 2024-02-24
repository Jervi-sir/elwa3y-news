import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Api from '@utils/Api';
import KeyNames from '@utils/KeyNames';
import { useEffect } from 'react';
import { insertNotification } from './notificationsDB';
import { useNotification } from './NotificationContext';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@utils/Routes';
import axios from 'axios';

export const setNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      const articleSlug = notification.request.content.data.articleSlug;

      return{
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }},
  });
};


export const registerForPushNotificationsAsync = async () => {
  let token;
  const storedToken = await AsyncStorage.getItem(KeyNames.expoPushToken);

  if (storedToken) {
    return storedToken;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  await AsyncStorage.setItem(KeyNames.expoPushToken, token);  // Store the token
  await AsyncStorage.setItem(KeyNames.expoNotificationIsDisabled, '0');  // Store the token
  
  return token;
};

//Local Norttification
export const schedulePushNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
};

export const sendPushTokenToServer = async (token) => {
  const expiryTime = Date.now() + 60 * 1000; // 7 * 24 * 60 * 1 week in milliseconds  
  try {
    const response = await fetch(Api.base + Api.subscribe_to_notifications, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ expo_token: token, expiration_date: expiryTime }),
    });

    if (response.ok) {
      
      await AsyncStorage.setItem(KeyNames.tokenDateSentToServer, expiryTime.toString());  // Mark that token has been sent
    } else {
      console.error('Failed to send push token to server');
    }
  } catch (error) {
    console.error('Failed to send push token to server', error);
  }
};

export const unsubscribeFromNotification = async () => {
  const token = await AsyncStorage.getItem(KeyNames.expoPushToken);
  const isDisabled = await AsyncStorage.getItem(KeyNames.expoNotificationIsDisabled);
  const newIsDisabled = isDisabled == '0' ? 1 : 0;
  console.log(token)
  try {
    axios.post(Api.base + Api.unsubscribe_to_notifications, {
      expo_token: token,
      isDisabled: newIsDisabled
    })
    .then(async (response) => {
      await AsyncStorage.setItem(KeyNames.expoNotificationIsDisabled, String(newIsDisabled));

    }).catch(error => {
      console.log(error);
    });
  } catch (error) {
    //console.error('Failed to send push token to server', (error));
  }
  return false;
};

export const initializeNotificationSettings = async () => {
  const tokenDateSentToServer = await AsyncStorage.getItem(KeyNames.tokenDateSentToServer);
  const isDisabled = await AsyncStorage.getItem(KeyNames.expoNotificationIsDisabled);

  if(isDisabled === null) {
    await AsyncStorage.setItem(KeyNames.expoNotificationIsDisabled, '0');
  }

  //if token not stored meaning user didnt subscrive
  if (tokenDateSentToServer === null) {
    const token = await registerForPushNotificationsAsync();
    if (token) {
      try {
        await sendPushTokenToServer(token);
        return true;
      }
      catch (err) {
        return false;
      }
    }
  }
  //console.log('condition: ' + (Date.now() >= parseInt(tokenDateSentToServer)))
  //if token is expired
  if (Date.now() >= parseInt(tokenDateSentToServer)){
    const token = await registerForPushNotificationsAsync();
    //console.log("generated token: " + token)
    //console.log("after token")
    if (token) {
      try {
        await sendPushTokenToServer(token);
        return true;
      }
      catch (err) {
        return false;
      }
    }
  }
 
};

export const useHandleNotificationForInit = (navigation) => {
  const { UnreadCount, setUnreadNotifications } = useNotification();

  useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener(handleNotificationReceived);
    const responseListener = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  const handleNotificationResponse = (response) => {
    const articleSlug = response.notification.request.content.data.articleSlug;
    navigation.navigate(Routes.ArticleNavigation, { slug: articleSlug });

    // Replace 'YourRouteHere' with the actual route name where you want to navigate
  };

  const handleNotificationReceived = (notification) => {
    const article = notification.request.content.data;
    console.log('handle notification received')

    insertNotification(article.title, article.thumbnail, article.articleSlug);
    setUnreadNotifications(UnreadCount + 1);
    // Here you can handle the received notification, e.g., by updating the state or showing an alert.
  };
};

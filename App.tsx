import { StatusBarTop } from '@components/StatusBarTop';
import { ArticleScreenOffline } from '@components/offline/ArticleScreenOffline';
import { ArticlesProvider } from '@context/ArticleProvider';
import { AuthProvider, useToken } from '@context/AuthContext';
import { BookmarkProvider } from '@context/BookmarkContext';
import { BottomSheetProvider } from '@context/BottomSheetContext';
import { LanguageProvider } from '@context/LanguageContext';

import { UserProfileProvider } from '@context/ProfileContext';
import { ColorProvider } from '@context/ThemeContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationScreen } from '@screens/NavigationScreen';
import { TestScreen } from '@screens/TestScreen';
import { ArticleNavigation } from '@screens/article/ArticleNavigation';
import { ArticleScreen } from '@screens/article/ArticleScreen';
import { Routes } from '@utils/Routes';
import { DBinit, deleteBookmarksTable } from 'functions/db';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import { dropNotificationTable, initDBNotification } from 'notifications/notificationsDB';

import { NotificationProvider } from 'notifications/NotificationContext';
import { initializeNotificationSettings, setNotificationHandler } from 'notifications/NotificationManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
const currentPlatform = Platform.OS;
const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'white' }}>
      <ColorProvider>
        <LanguageProvider>
          <AuthProvider>
            <UserProfileProvider>
              <NotificationProvider>
                <BookmarkProvider>
                  <StatusBarTop />
                  <BottomSheetProvider>
                    <AppContent />
                  </BottomSheetProvider>
                </BookmarkProvider>
              </NotificationProvider>
            </UserProfileProvider>
          </AuthProvider>
        </LanguageProvider>
      </ColorProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const { token } = useToken();
  const modalOption = {
    gestureEnabled: false,
    presentation: currentPlatform == 'android' ? 'transparentModal ' : 'modal',
    contentStyle: {
      backgroundColor: currentPlatform == 'android' ? 'rgba(0,0,0,0.5)' : 'transparent',
      height: '10%'
    }
  }
  const screenOption = {
    presentation: currentPlatform == 'android' ? 'transparentModal' : 'card',
    contentStyle: {
      backgroundColor: currentPlatform == 'android' ? 'rgba(0,0,0,1)' : 'transparent',
      height: '10%'
    }
  }

  useEffect(() => {
    //AsyncStorage.getItem('expoPushToken').then(e => console.log(e));
    DBinit();
    initDBNotification();
    setNotificationHandler();

    initializeNotificationSettings();
  }, [])
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureDirection: 'horizontal',
          
        }}

      >
        <Stack.Screen name={Routes.Navigation} component={NavigationScreen} />
        <Stack.Screen name={Routes.ArticleNavigation} component={ArticleNavigation} />
        <Stack.Screen name={Routes.ArticleOffline} component={ArticleScreenOffline} />
        
        <Stack.Screen name={Routes.Notifications} component={TestScreen} />
        {/*
          token == null
          &&
          <>
            <Stack.Screen name={Routes.Login} component={TestScreen} options={modalOption} />
            <Stack.Screen name={Routes.Register} component={TestScreen} options={modalOption} />
          </>
      */}
      </Stack.Navigator>
    </NavigationContainer>
  )
}


import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from '@utils/Routes';
//import { CommentList } from '@screens/article/CommentList';
import { ArticleScreen } from './ArticleScreen';
import { Platform } from 'react-native';
import { ArticleProvider } from './ArticleContext';
import { useEffect } from 'react';
import { CommentsBottomSheetProvider } from './CommentBottomSheetContext';

const Stack = createStackNavigator();

const currentPlatform = Platform.OS;

export const ArticleNavigation = ({ route }) => {

  const modalOption = {
    gestureEnabled: true,
    presentation: currentPlatform == 'android' ? 'transparentModal ' : 'modal',
    contentStyle: {
      backgroundColor: currentPlatform == 'android' ? 'rgba(0,0,0,0.5)' : 'transparent',
      height: '10%'
    }
  }

  return (
    <ArticleProvider>
      <CommentsBottomSheetProvider>
        <ArticleScreen
          route={route}
        />
      </CommentsBottomSheetProvider>
    </ArticleProvider>
  )
}

const OldNav = ({ route }) => {
  const { slug } = route.params;
  return (
    <ArticleProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardOverlayEnabled: true,
        }}
        detachInactiveScreens={true}
      >
        <Stack.Screen
          name={Routes.Article}
          component={ArticleScreen}
          initialParams={{ slug: slug }}
        />
        {/*
        <Stack.Screen name={Routes.CommentList} component={CommentList} options={modalOption} />
        */}
      </Stack.Navigator>
    </ArticleProvider>
  );
}
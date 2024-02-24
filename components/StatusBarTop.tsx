import { useColors } from '@context/ThemeContext';;
import { View, StatusBar } from 'react-native';

import { Dimensions, Platform } from 'react-native';

const viewportHeight = Dimensions.get('window').height;
const WINDOW_HEIGHT = Dimensions.get('window').height;

let statusBarHeight = 0;

if (Platform.OS === 'android') {
   statusBarHeight = 24;
} else {
   statusBarHeight = 44;
}

const VIEWPORT_HEIGHT = WINDOW_HEIGHT - statusBarHeight;

export const StatusBarTop = () => {
   const { Colors, currentTheme } = useColors();
   console.log(currentTheme)
   const height = viewportHeight - VIEWPORT_HEIGHT;
      return (
         <View style={{ backgroundColor: Colors.statusBar, height }} >
            {
               currentTheme === 'light'
               ?
               <StatusBar barStyle='dark-content' />
               :
               <StatusBar barStyle='light-content' />
            }
         </View>
      )
}
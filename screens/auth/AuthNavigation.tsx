import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from './Login';
import { RegisterScreen } from './Register';
import { TermsAction } from './TermsAction';
import { Routes } from '@utils/Routes';
import { Text } from 'react-native';

const Stack = createStackNavigator();

export const AuthNavigation = () => {
  return (
    <>
      <Stack.Navigator initialRouteName={'bunt'}>
        <Stack.Screen name={'bunt'} component={LoginScreen} />
      </Stack.Navigator>
    </>
  )
}; 

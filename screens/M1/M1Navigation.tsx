import { createStackNavigator } from "@react-navigation/stack";
import { Routes } from "@utils/Routes";
import { HomeScreen } from "./HomeScreen";
import { NotificationScreen } from "./NotificationScreen";
import { M1Provider } from "./M1Context";

const Stack = createStackNavigator();
export const M1Navigation = () => {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardOverlayEnabled: true,
        }}
        detachInactiveScreens={true}
      >
        
        <Stack.Screen name={Routes.Home} component={HomeScreen} />
        <Stack.Screen name={Routes.Notifications} component={NotificationScreen} />
      </Stack.Navigator>
    </>
  )
}
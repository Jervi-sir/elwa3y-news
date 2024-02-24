import { createStackNavigator } from "@react-navigation/stack";
import { Routes } from "@utils/Routes";
import { SettingScreen } from "./SettingScreen";
import { EditProfile } from "./EditProfile";

const Stack = createStackNavigator();
export const M4Navigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardOverlayEnabled: true,
      }}
      detachInactiveScreens={true}
    >
      <Stack.Screen name={Routes.SettingList} component={SettingScreen} />
      <Stack.Screen name={Routes.editProfile} component={EditProfile} />
    </Stack.Navigator>
  )
}
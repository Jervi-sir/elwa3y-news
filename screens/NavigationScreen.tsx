import { useColors } from "@context/ThemeContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@utils/Routes";
import { MaterialCommunityIcons, MaterialIcons, Octicons, Feather} from 'react-native-vector-icons';
import { M1Navigation } from "./M1/M1Navigation";
import { M2Navigation } from "./M2/M2Navigation";
import { M3Navigation } from "./M3/M3Navigation";
import { M4Navigation } from "./M4/M4Navigation";
import { useHandleNotificationForInit } from "notifications/NotificationManager";

const Tabs = createBottomTabNavigator();

export const NavigationScreen = () => {
  const { Colors } = useColors();
  const navigation = useNavigation();

  useHandleNotificationForInit(navigation)

  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarInactiveTintColor: Colors.iconPrimary,
        tabBarActiveTintColor: Colors.iconActive,
        tabBarStyle:{
          backgroundColor: Colors.background, 
          borderTopColor: Colors.separator,
          borderTopWidth: 2,
          height: 80
        },
      }}
      
    >
      <Tabs.Screen
        name={Routes.M1}
        component={M1Navigation}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <>
              <TabBarIcon name="home" tintColor={color} />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name={Routes.M2}
        component={M2Navigation}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <>
              <TabMaterialIcons name="explore" tintColor={color} />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name={Routes.M3}
        component={M3Navigation}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <>
              <TabMaterialCommunityIcons focused={focused} tintColor={color} name={focused ? "bookmark-multiple" : "bookmark-multiple-outline"} />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name={Routes.M4}
        component={M4Navigation}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <>
              <OcticonsIcons focused={focused} tintColor={color} name="gear" />
            </>
          ),
        }}
      />
    </Tabs.Navigator>
  )
}

const TabBarIcon = (props: any) => {
  return (
    <Feather
      name={props.name}
      size={props.size ? props.size : 24}
      color={props.tintColor}
    />
  );
};

const OcticonsIcons = (props: any) => {
  return (
    <Octicons
      name={props.name}
      size={props.size ? props.size : 24}
      color={props.tintColor}
    />
  );
};

const TabMaterialIcons = (props: any) => {
  return (
    <MaterialIcons
      name={props.name}
      size={props.size ? props.size : 24}
      color={props.tintColor}
    />
  );
};

const TabMaterialCommunityIcons = (props: any) => {
  return (
    <MaterialCommunityIcons
      name={props.name}
      size={props.size ? props.size : 24}
      color={props.tintColor}
    />
  );
};
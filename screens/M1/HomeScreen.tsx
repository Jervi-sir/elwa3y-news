import { useLanguage } from "@context/LanguageContext";
import { useColors } from "@context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@utils/Routes";
import TabCollection from "@utils/TabCollection";
import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons} from "@expo/vector-icons"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { CategoryScreen } from "./CategoryScreen";
import { useNotification } from "notifications/NotificationContext";

const Tab = createMaterialTopTabNavigator();

export const HomeScreen = () => {
  const { Colors } = useColors();
  const { languageData } = useLanguage();
  
	const navigation = useNavigation();
	const lastTab = TabCollection[TabCollection.length - 1];

	const tabOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const id = tabOffset.addListener(({ value }) => {
      console.log("Animated value: ", value);
    });

    return () => {
      tabOffset.removeListener(id);
    };
  }, [tabOffset]);

  return (
    <>
      <HeaderTop />
      <View style={{ flex: 1, paddingHorizontal: 0, backgroundColor: Colors.background }}>
        <Tab.Navigator
          initialRouteName={lastTab.name}
          screenOptions={{
            lazy: true,
            tabBarScrollEnabled: true,
            tabBarContentContainerStyle: {
              //flexDirection: 'row-reverse',
            },
            tabBarStyle: {
              backgroundColor: 'transparent',
              elevation: 0,
            },
            tabBarLabelStyle: { padding: 0, margin: 0 },
            tabBarActiveTintColor: 'black',

            tabBarIndicatorStyle: {
              backgroundColor: Colors.textPrimary,
              flexDirection: 'row-reverse',
              height: 4, maxWidth: '60%',
              marginHorizontal: '2.5%',
              borderTopEndRadius: 100,
              borderTopStartRadius: 100,
            },
            animationEnabled: true,
            swipeEnabled: true,

          }}
          sceneContainerStyle={{
            backgroundColor: Colors.background,
          }}

        >
          {
            TabCollection.map(tab => (
              <Tab.Screen
                key={tab.name}
                name={tab.name}
                component={CategoryScreen} // reuse same component
                initialParams={{ category: tab.category }}
                listeners={{
                  tabPress: (e) => {
                    //e.preventDefault();
                  },
                }}
                options={{
                  tabBarActiveTintColor: Colors.textPrimary,
                  tabBarInactiveTintColor: Colors.textPrimary,
                }}

              />
            ))
          }
        </Tab.Navigator>
      </View>
    </>
  )
}


const HeaderTop = () => {
  const { Colors } = useColors();
  const { languageData } = useLanguage();
	const navigation = useNavigation();
	const { UnreadCount } = useNotification();

  return (
    <View style={{backgroundColor: Colors.background, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20}}>
      <Text style={{color: Colors.iconPrimary, fontSize: 25, fontWeight: '600'}}>{ languageData.home }</Text>
      <TouchableOpacity
				onPress={() => {
            //schedulePushNotification()
						navigation.navigate(Routes.Notifications);
					}
				}
			>
				{
          UnreadCount != 0
					&&
					<View style={{position: 'absolute', top: 2, right: 2, zIndex: 99, height: 10, width: 10, backgroundColor: Colors.iconWarning, borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
						<Text style={{color: Colors.backgroundDanger}}>{  }</Text>
					</View>
				}
        <MaterialCommunityIcons
          name='bell-outline'
          size={30}
          color={Colors.iconPrimary}
        />
      </TouchableOpacity>
    </View>
  )
}
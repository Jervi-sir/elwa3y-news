import CollapsibleView from "@components/CollapsibleView";
import { BottomSheetContext, useBottomSheet } from "@context/BottomSheetContext";
import { useToken } from "@context/AuthContext";
import { useLanguage } from "@context/LanguageContext";
import { useColors } from "@context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@utils/Routes";
import { Alert, Button, Image, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { TermScreen } from "./TermScreen";
import { AboutScreen } from "./AboutScreen";
import { LoginScreen } from "@screens/auth/Login";
import { RegisterScreen } from "@screens/auth/Register";
import axios from "axios";
import Api from "@utils/Api";
import { showServerError } from "functions/helpers";
import { useUserProfile } from "@context/ProfileContext";

export const SettingScreen = () => {
  const { Colors, toggleTheme, currentTheme } = useColors();
  const { token, isAuthenticated } = useToken();
  const { languageData } = useLanguage();
  const navigation = useNavigation();
  const { openBottomSheet } = useBottomSheet();

  return (
    <>
      <ScrollView style={{ backgroundColor: Colors.backgroundLight }}>
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
          <AuthSection />
          {/*-----Configure the App-----*/}
          <SeparatorSection text={languageData.configure_the_app} />
          {/* Edit Profile */}
          <EditSection />
          {/* Dark Theme */}
          <SwitchTheme />
          <View style={{ height: 1, backgroundColor: Colors.separator }}></View>
          {/* Push notifications   <PushNotifications /> */}
          <View style={{ height: 1, backgroundColor: Colors.separator }}></View>
          {/*-----About the app-----*/}
          <SeparatorSection text={languageData.about_the_app} />
          {/* Terms of Service */}
          <TouchableOpacity
            style={{ backgroundColor: Colors.background, paddingHorizontal: 20, paddingVertical: 20 }}
            onPress={() => openBottomSheet(<TermScreen />)}
          >
            <Text style={{ color: Colors.textPrimary, fontSize: 15, fontWeight: '400', textAlign: 'right' }}>{languageData.terms_of_services}</Text>
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: Colors.separator }}></View>
          {/* Privacy Policy */}
          <TouchableOpacity
            style={{ backgroundColor: Colors.background, paddingHorizontal: 20, paddingVertical: 20 }}
            onPress={() => openBottomSheet(<AboutScreen />)}
          >
            <Text style={{ color: Colors.textPrimary, fontSize: 15, fontWeight: '400', textAlign: 'right' }}>{languageData.privacy_policy}</Text>
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: Colors.separator }}></View>
          {/*-----App Controls-----*/}
          <SeparatorSection text={languageData.app_controls} />
          {/* Clear all caches */}
          <ClearCache />
          {/*-----Sign out-----*/}
          <View style={[{ height: 1, backgroundColor: Colors.separator }, { height: 8 }]}></View>
          <LogoutSection />

          <View style={[{ height: 1, backgroundColor: Colors.separator }, { height: 'auto', paddingHorizontal: 20, paddingVertical: 20 }]}>
            <Text style={{ color: Colors.textPrimary, fontSize: 15, fontWeight: '500', textAlign: 'right' }}>Version 1.01</Text>
          </View>

        </View>
      </ScrollView>
    </>
  )
}

const SeparatorSection = ({ text }) => {
  const { Colors } = useColors();
  return (
    <>
      <View style={{backgroundColor: Colors.backgroundLight, paddingHorizontal: 20, paddingVertical: 20}}>
        <Text style={{color: Colors.textPrimary, fontSize: 15, fontWeight: '700', textAlign: 'right' }}>{text}</Text>
      </View>
      <View style={{height: 1, backgroundColor: Colors.separator}}></View>
    </>
  )
}

const LogoutSection = () => {
  const { token, isAuthenticated, removeToken } = useToken();
  const { Colors } = useColors();
  const { languageData } = useLanguage();

  const logoutAlert = () => {
    Alert.alert(
      '',
      languageData.confirmLogout,
      [
        {
          text: languageData.cancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: languageData.yes,
          onPress: () => handleLogout(),
          style: 'destructive',
        },
        
      ],
      {
        cancelable: true,
      }
    );
  };

  const handleLogout = () => {
    if(!token) return 0;
    
    axios.post(Api.base + Api.logout, {}, {
       headers: {
          'Authorization': 'Bearer ' + token
       }
    })
    .then(response => {
       if (response.status === 200) {
          removeToken();
       }
    })
    .catch(error => {
       console.error('Failed to log out', showServerError(error));
    });
  };

  return (
    <>
      {
        isAuthenticated
        &&
        <TouchableOpacity
          onPress={logoutAlert}
          style={{ backgroundColor: Colors.background, paddingHorizontal: 20, paddingVertical: 20 }}
        >
          <Text style={{ color: Colors.textDanger, fontSize: 15, fontWeight: '400', textAlign: 'right' }}>{languageData.sign_out}</Text>
        </TouchableOpacity>
      }
    </>
  )

}

const EditSection = () => {
  const { isAuthenticated } = useToken();
  const { Colors } = useColors();
  const navigation = useNavigation();
  const { languageData } = useLanguage();

  return (
    <>
      {
        isAuthenticated
        &&
        <>
          <TouchableOpacity
            style={{ backgroundColor: Colors.background, paddingHorizontal: 20, paddingVertical: 20 }}
            onPress={() => navigation.navigate(Routes.editProfile)}
          >
            <Text style={{ color: Colors.textPrimary, fontSize: 15, fontWeight: '400', textAlign: 'right' }}>{languageData.edit_profile}</Text>
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: Colors.separator }}></View>
        </>
      }
    </>
  )
}

const ProfileSection = () => {
  const { Colors } = useColors();
  const { languageData } = useLanguage();
  const navigation = useNavigation();
  const { profile } = useUserProfile();

  return (
    <>
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
        {
          profile.profile_photo_path == null
          ?
          <Image source={require('@assets/profile.png')} style={{ width: 69, height: 69 }} />
          :
          <Image source={{ uri: profile.profile_photo_path }} style={{ width: 69, height: 69, borderRadius: 100 }} />
        }
        <View style={{ justifyContent: 'space-between', marginHorizontal: 20 }}>
          <Text style={{ color: Colors.textPrimary, fontSize: 15, fontWeight: '600', textAlign: 'right' }}>{ profile.name }</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(Routes.editProfile)}
            style={{ borderColor: Colors.separator, paddingTop: 15 }}
          >
            <Text style={{ color: Colors.textPrimary, fontSize: 13, fontWeight: '400', textDecorationLine: 'underline', opacity: 0.7 }}>{ languageData.edit_your_profile }</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

const PushNotifications = () => {
  const { Colors } = useColors();
  const { languageData } = useLanguage();

  return (
    <View
      style={{ backgroundColor: Colors.background, paddingHorizontal: 20, paddingVertical: 14, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Text style={{ color: Colors.textPrimary, fontSize: 15, fontWeight: '400' }}>{languageData.push_notifications}</Text>
      <Switch
        trackColor={{ false: Colors.backgroundLight, true: Colors.textSuccess }}
        thumbColor={!notificationIsEnabled ? Colors.textPrimary : Colors.textSecondary}
        ios_backgroundColor={Colors.backgroundLight}
        onValueChange={switchNotifications}
        value={!notificationIsEnabled}
      />
    </View>
  )
}

const SwitchTheme = () => {
  const { Colors, toggleTheme, currentTheme } = useColors();
  const { languageData } = useLanguage();

  return (
    <View
      style={{ backgroundColor: Colors.background, paddingHorizontal: 20, paddingVertical: 14, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Text style={{ color: Colors.textPrimary, fontSize: 15, fontWeight: '400' }}>{languageData.light_theme}</Text>
      <Switch
        trackColor={{ false: Colors.backgroundLight, true: Colors.textSuccess }}
        thumbColor={currentTheme === 'light' ? Colors.textPrimary : Colors.textSecondary}
        ios_backgroundColor={Colors.backgroundLight}
        onValueChange={toggleTheme}
        value={currentTheme === 'light'}
      />
    </View>
  )
}

const AuthSection = () => {
  const { isAuthenticated } = useToken();
  const { Colors } = useColors();
  const { languageData } = useLanguage();
  const { openBottomSheet, onClose } = useBottomSheet();

  return (
    <View style={{ paddingHorizontal: 40, paddingVertical: 30 }}>
      {
        isAuthenticated
          ?
          <ProfileSection />
          :
          <View style={{ flexDirection: 'row-reverse', justifyContent: 'center' }}>
            <TouchableOpacity
              onPress={() => {openBottomSheet(<LoginScreen />, ['86%', '95%', '95%'])}}
              style={{ borderColor: Colors.separator, borderWidth: 2, borderRadius: 100, paddingHorizontal: 20, paddingVertical: 10 }}
            >
              <Text style={{ color: Colors.textPrimary, fontSize: 13, fontWeight: '400' }}>{languageData.login}</Text>
            </TouchableOpacity>
            <View style={{ width: 20 }}></View>
            <TouchableOpacity
              onPress={() => {openBottomSheet(<RegisterScreen />, ['86%', '95%', '95%'])}}
              style={{ borderColor: Colors.separator, borderWidth: 2, borderRadius: 100, paddingHorizontal: 20, paddingVertical: 10 }}
            >
              <Text style={{ color: Colors.textPrimary, fontSize: 13, fontWeight: '400' }}>{languageData.create_an_account}</Text>
            </TouchableOpacity>
          </View>
      }
    </View>
  )
}

const ClearCache = () => {
  const { languageData } = useLanguage();
  const { Colors } = useColors();

  const showAlert = () => {
    Alert.alert(
      languageData.warning,
      languageData.confirmClearCache,
      [
        {
          text: languageData.cancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: languageData.yes,
          onPress: () => console.log('OK Pressed'),
          style: 'destructive',
        },
        
      ],
      {
        cancelable: true,
      }
    );
  };

  return (
    <TouchableOpacity
      onPress={showAlert}
      style={{ backgroundColor: Colors.background, paddingHorizontal: 20, paddingVertical: 20 }}
    >
      <Text style={{ color: Colors.textPrimary, fontSize: 15, fontWeight: '400', textAlign: 'right' }}>{languageData.clear_all_caches}</Text>
    </TouchableOpacity>
  )
}
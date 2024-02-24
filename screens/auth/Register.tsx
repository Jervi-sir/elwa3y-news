import { useColors } from '@context/ThemeContext';
import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Platform } from 'react-native';
import axios from 'axios';
import Api from '@utils/Api';
import { useToken } from '@context/AuthContext';
import { useLanguage } from '@context/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KeyNames from '@utils/KeyNames';
import { useBottomSheet } from '@context/BottomSheetContext';
import { LoginScreen } from './Login';
import { useUserProfile } from '@context/ProfileContext';

export const RegisterScreen = () => {
  const { Colors } = useColors();
  const { saveToken } = useToken();
  const { languageData } = useLanguage();
  const { openBottomSheet, onClose } = useBottomSheet();
  //const { updateProfileContext } = useProfile();
  const { saveProfile } = useUserProfile();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  const deviceType = Platform.OS + " v" + Platform.Version; //to know feed statistics about most used devices type ['privacy is concerned']

  const formatPhoneNumber = (input) => {
    input = input.replace(/[^\d]/g, '');
    input = input.substring(0, 10);
    let formatted = '';
    for (let i = 0; i < input.length; i++) {
      const digit = input[i];
      if (i === 0) { formatted += '('; }
      if (i === 4) { formatted += ') '; }
      if (i === 6 || i === 8) { formatted += ' '; }
      formatted += digit;
    }
    return formatted;
  };

  const handlePhoneNumberChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);
  };

  const handleRegister = async () => {
    if (fullName === '') return console.log('missing Name');
    if (phone === '') return console.log('missing phone');
    if (password === '') return console.log('missing password');
    setIsFetching(true);
    const expoToken = await AsyncStorage.getItem(KeyNames.expoPushToken)

    // Call API to Register
    axios.post(Api.base + Api.register, {
      name: fullName,
      phone_number: phone.replace(/[\s()-]/g, ""),
      password: password,
      deviceType: deviceType,   //to know feed statistics about most used devices type ['privacy is concerned']
      expo_token: expoToken,
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        const token = response.data.access_token;
        handleStoreToken(token);
        saveToken(token);
        setIsFetching(false);
        saveProfile(response.data.user)
        onClose();

        //updateProfileContext(response.data.username, response.data.imageUrl);

        //navigation.goBack();
        /*navigation.reset({
          index: 0,
          routes: [{ name: Routes.Navigation }],
        });*/
      })
      .catch(error => {
        Alert.alert(
          'خطأ',
          error.response.data.errors.phone_number[0],
          [
            {
              text: languageData.cancel,
              style: 'cancel',
            },
          ],
          {
            cancelable: true,
          }
        );
        setIsFetching(false);
      });
  };

  const handleStoreToken = async (token) => {
    try {
      saveToken(token);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const styles = StyleSheet.create({
    input: {
      height: 50,
      paddingLeft: 20,
      flex: 1,
      color: Colors.textPrimary,
      width: '100%',
      fontSize: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      textAlign: 'right'
    },
    label: {
      fontSize: 17,
      fontWeight: '700',
      paddingVertical: 10,
      textAlign: 'right'
    },

    inputContainer: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      borderRadius: 100,
    }
  })

  return (
    <>
      <KeyboardAwareScrollView
        extraScrollHeight={20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView >
            <View style={{ paddingVertical: 30, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ alignItems: 'flex-end', width: '80%', marginBottom: 30 }}>
                <Text style={{ color: Colors.textPrimary }}>{languageData.app_name}</Text>
                <Text style={{ color: Colors.textPrimary, fontWeight: '600', fontSize: 30 }}>{languageData.welcome_back}</Text>
              </View>
              <View style={{ width: '80%' }}>
                <View style={{ marginBottom: 40 }}>
                  <Text style={{ color: Colors.textPrimary, fontWeight: '400', fontSize: 15, paddingLeft: 10, textAlign: 'right' }}>{languageData.username}</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="....."
                      style={styles.input}
                      placeholderTextColor={Colors.textSecondary}
                      value={fullName}
                      onChangeText={setFullName}
                    />
                  </View>
                  <View style={{ height: 2, backgroundColor: Colors.separator }}></View>
                </View>

                <View style={{ marginBottom: 40 }}>
                  <Text style={{ color: Colors.textPrimary, fontWeight: '400', fontSize: 15, paddingLeft: 10, textAlign: 'right' }}>{languageData.phone_number}</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="(....) .. .. .."
                      style={styles.input}
                      placeholderTextColor={Colors.textSecondary}
                      value={phone}
                      onChangeText={handlePhoneNumberChange}
                      keyboardType="phone-pad"
                    />
                  </View>
                  <View style={{ height: 2, backgroundColor: Colors.separator }}></View>
                </View>

                <View>
                  <Text style={{ color: Colors.textPrimary, fontWeight: '400', fontSize: 15, paddingLeft: 10, textAlign: 'right' }}>{languageData.password}</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="********"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      style={styles.input}
                      placeholderTextColor={Colors.textSecondary}
                    />
                    <Ionicons
                      name={showPassword ? 'eye' : 'eye-off'}
                      size={22}
                      color="grey"
                      onPress={() => setShowPassword(!showPassword)}
                      style={{ paddingHorizontal: 20 }}
                    />
                  </View>
                  <View style={{ height: 2, backgroundColor: Colors.separator }}></View>
                </View>
                <View
                  style={{ backgroundColor: Colors.textSuccess, marginTop: 40, alignItems: 'center', borderRadius: 100, paddingVertical: 5 }}
                >
                  {
                    isFetching
                      ?
                      <View style={{ paddingVertical: 9, }}>
                        <ActivityIndicator
                          color={Colors.icons}
                          style={{ width: 20, height: 20 }}
                        />
                      </View>
                      :
                      <TouchableOpacity
                        onPress={handleRegister}
                        style={{ paddingVertical: 10, width: '100%', borderRadius: 7 }}
                      >
                        <Text style={{ textAlign: 'center', fontSize: 18, color: Colors.background }}>{languageData.create_account}</Text>
                      </TouchableOpacity>
                  }
                </View>
              </View>
              {/*
            <View style={{ width: '80%' }}>
              <SocialLogin />
            </View>
            */}
              <View style={{paddingVertical: 20}}>
              <TouchableOpacity
                style={{flexDirection: 'row-reverse', }}
                onPress={() => openBottomSheet(<LoginScreen />)}
              >
                <Text style={{color: Colors.textPrimary}}>{ languageData.already_have_account }</Text>
                <Text>{' '}</Text>
                <Text style={{color: Colors.textSuccess, textDecorationLine: 'underline'}}>{ languageData.login_here }</Text>
              </TouchableOpacity>
            </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </>
  )
}

const SocialLogin = () => {
  const { Colors } = useColors();
  const { languageData } = useLanguage();

  const styleSocial = StyleSheet.create({
    socialButton: {
      backgroundColor: Colors.separator,
      paddingVertical: 10,
      alignItems: 'center',
      flex: 1,
      borderRadius: 100,
    },
  })
  const styles = StyleSheet.create({
    line: {
      height: 2,
      flex: 1,
      backgroundColor: Colors.separator,
    },
  })
  return (
    <View style={{ marginTop: 0, marginBottom: 30 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.line}></View>
        <Text style={{ fontWeight: '700', fontSize: 15, marginHorizontal: 20, color: Colors.textSecondary }}>{languageData.or}</Text>
        <View style={styles.line}></View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 20 }}>
        <TouchableOpacity style={styleSocial.socialButton}>
          <AuthIcon name="logo-facebook" />
        </TouchableOpacity>
        <TouchableOpacity style={[styleSocial.socialButton, { marginHorizontal: 20 }]}>
          <AuthIcon name="logo-google" />
        </TouchableOpacity>
        <TouchableOpacity style={styleSocial.socialButton}>
          <AuthIcon name="logo-apple" />
        </TouchableOpacity>
      </View>

    </View>
  )
}

const AuthIcon = (props: any) => {
  const { Colors } = useColors();
  return (
    <Ionicons
      name={props.name}
      size={props.size ? props.size : 24}
      color={Colors.textPrimary}
      style={{}}
    />
  );
};



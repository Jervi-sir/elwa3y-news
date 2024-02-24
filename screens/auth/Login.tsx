import { useColors } from '@context/ThemeContext';
import { useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback, StyleSheet, Alert } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Api from '@utils/Api';
import { useToken } from '@context/AuthContext';
import { useLanguage } from '@context/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KeyNames from '@utils/KeyNames';
import { useBottomSheet } from '@context/BottomSheetContext';
import { RegisterScreen } from './Register';
import { useUserProfile } from '@context/ProfileContext';
 
export const LoginScreen = () => {
  const { Colors } = useColors();
  const { saveToken } = useToken(); 
  const { languageData } = useLanguage();
  const { saveProfile } = useUserProfile();
  const { openBottomSheet, onClose } = useBottomSheet();

  const [password, setPassword] = useState('raaahaaan');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('0558054300');
  const [isFetching, setIsFetching] = useState(false);

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

  const handleLogin = async () => {
    if (phone === '') return console.log('missing phone');
    if (password === '') return console.log('missing password');
    setIsFetching(true);
    const expoToken = await AsyncStorage.getItem(KeyNames.expoPushToken)

    // You should validate email and password before sending a request
    axios.post(Api.base + Api.login, {
      phone_number: phone.replace(/[\s()-]/g, ""),
      password: password,
      expo_token: expoToken
    })
      .then(response => {
        const token = response.data.access_token;
        saveToken(token);
        handleStoreToken(token);
        setIsFetching(false);
        
        saveProfile(response.data.user)
        onClose();
        //updateProfileContext(response.data.username, response.data.imageUrl);
        
        //navigation.goBack();
        /*navigation.reset({
          index: 0,
          routes: [{ name: Routes.Navigation }],
        });
        */
      })
      .catch(error => {
        Alert.alert(
          'خطأ', 
          error.response.data.message,
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
      <>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ paddingVertical: 30, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ alignItems: 'flex-end', width: '80%' }}>
              <Text style={{ color: Colors.textPrimary, textAlign: 'right' }}>{ languageData.app_name }</Text>
              <Text style={{ color: Colors.textPrimary, fontWeight: '600', fontSize: 30, textAlign: 'right' }}>{ languageData.welcome_back }</Text>
            </View>
            <View style={{ width: '80%' }}>
              <View style={{ marginBottom: 40, marginTop: 20 }}>
                <Text style={{ color: Colors.textPrimary, fontWeight: '400', fontSize: 15, paddingLeft: 10, textAlign: 'right' }}>{ languageData.phone_number }</Text>
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
                <Text style={{ color: Colors.textPrimary, fontWeight: '400', fontSize: 15, paddingLeft: 10, textAlign: 'right' }}>{ languageData.password }</Text>
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
                      onPress={handleLogin}
                      style={{ paddingVertical: 10, width: '100%', borderRadius: 7 }}
                    >
                      <Text style={{ textAlign: 'center', fontSize: 18, color: Colors.background }}>{ languageData.login }</Text>
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
                onPress={() => openBottomSheet(<RegisterScreen />)}
              >
                <Text style={{color: Colors.textPrimary}}>{ languageData.dont_have_account }</Text>
                <Text>{' '}</Text>
                <Text style={{color: Colors.textSuccess, textDecorationLine: 'underline'}}>{ languageData.register_here }</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </>
    </>
  )
}

const SocialLogin = () => {
  const { Colors } = useColors();
  const { languageData } = useLanguage();
  const styles = StyleSheet.create({
    line: {
      height: 2,
      flex: 1,
      backgroundColor: Colors.separator,
    },
  })
  const styleSocial = StyleSheet.create({
    socialButton: {
      backgroundColor: Colors.separator,
      paddingVertical: 10,
      alignItems: 'center',
      flex: 1,
      borderRadius: 100,
    },
  })
  return (
    <View style={{ marginTop: 0, marginBottom: 30 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.line}></View>
        <Text style={{ fontWeight: '700', fontSize: 15, marginHorizontal: 20, color: Colors.textSecondary }}>{ languageData.or }</Text>
        <View style={styles.line}></View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 20 }}>
        <TouchableOpacity style={styleSocial.socialButton}>
          <AuthIcon name="logo-facebook" />
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


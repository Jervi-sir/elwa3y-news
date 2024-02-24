import { useColors } from "@context/ThemeContext";
import { TouchableOpacity } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Google from 'expo-google-app-auth';

export const GoogleAuth = () => {
  const { Colors } = useColors();

  const signInWithGoogleAsync = async () => {
    console.log(1)
    try {
      console.log(2)
      const result = await Google.logInAsync({
        androidClientId: 'YOUR_ANDROID_CLIENT_ID',
        iosClientId: 'YOUR_IOS_CLIENT_ID',
        scopes: ['profile', 'email'],
      });
      console.log(3)
  
      if (result.type === 'success') {
        // Send this token to your backend for validation
        sendTokenToBackend(result.idToken);
        return result.accessToken;
      } else {
        return { canceled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };
  
  const sendTokenToBackend = async (idToken) => {
    // Implement API call to your Laravel backend here.
    // E.g., Axios.post('/api/google-auth', { idToken });
  };
  

  return (
    <>
      <TouchableOpacity 
        onPress={signInWithGoogleAsync} 
        style={{backgroundColor: Colors.separator, paddingVertical: 10, alignItems: 'center', flex: 1, borderRadius: 100, marginHorizontal: 20 }}
      >
        <AuthIcon name="logo-google" />
      </TouchableOpacity>
    </>
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
import { useToken } from "@context/AuthContext";
import { useLanguage } from "@context/LanguageContext";
import { useUserProfile } from "@context/ProfileContext";
import { useColors } from "@context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import Api from "@utils/Api";
import axios from "axios";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

import { EvilIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { compressAndEncodeImage } from "functions/helpers";
import * as ImagePicker from 'expo-image-picker';

export const EditProfile = () => {
  const { Colors } = useColors();
  const { token } = useToken();
  const { languageData } = useLanguage();
  const navigation = useNavigation();
  const { profile, saveProfile, updateProfile } = useUserProfile();

  const [ name, setName ] = useState(profile.name)
  const [ firstName, setFirstName ] = useState(profile.firstName)
  const [ lastName, setLastName ] = useState(profile.lastName)
  const [ bio, setBio ] = useState(profile.bio)
  const [ email, setEmail ] = useState(profile.email)
  const [ phone_number, setPhone_number ] = useState(profile.phone_number)
  const [ profile_photo_path, setProfile_photo_path ] = useState(profile.profile_photo_path)
  
  const [isSaving, setIsSaving] = useState(false);
  const [imageIsSet, setImageIsSet] = useState(false);

  const getProfile = async () => {
    try {
      const response = await axios.get(Api.base + Api.profile, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = response.data;
      saveProfile(data.user);

    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
    });

    if (!result.canceled) {
      setImageIsSet(true);
      setProfile_photo_path(result.assets[0].uri);
    }
  };

  const fetchUpdateProfile = async () => {
    setIsSaving(true);
    let compressImage = null;
    if (imageIsSet) {
      compressImage = await compressAndEncodeImage(profile_photo_path);
    }
    try {
      const response = await axios.post(
        Api.base + Api.update_profile,
        {
          username: name,
          first_name: firstName,
          last_name: lastName,
          bio: bio,
          email: email,
          profile_image: imageIsSet ? compressImage : null,
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        }
      );
      saveProfile(response.data.user)
      setIsSaving(false);
      navigation.goBack();
    } catch (error) {
      setIsSaving(false);
      console.log("Error updating profile: ", JSON.stringify(error.response.data));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, paddingHorizontal: 20 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => navigation.goBack()}
            >
              <EvilIcons
                name="arrow-left"
                size={30}
                color={Colors.iconActive}
              />
            </TouchableOpacity>
            <Text style={{ color: Colors.textPrimary, fontSize: 16, fontWeight: "600", }}>{languageData.edit_profile}</Text>
            {
              isSaving
                ?
                <View>
                  <ActivityIndicator
                    color={Colors.textSuccess}
                    style={{ width: 25, height: 25 }}
                  />
                </View>
                :
                <TouchableOpacity
                  onPress={fetchUpdateProfile}
                >
                  <Text style={{ color: Colors.textSuccess, fontSize: 14, fontWeight: "400", }}>{languageData.save}</Text>
                </TouchableOpacity>
            }
          </View>
          <KeyboardAwareScrollView
            extraScrollHeight={40}
          >
            <View style={{width: '100%', alignSelf: 'flex-end', paddingHorizontal: 20}}>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginTop: 50 }}>
                <View style={{ width: 69, height: 69, borderRadius: 100, overflow: 'hidden', }}>
                  {
                    profile_photo_path == null
                      ?
                      <Image source={require('@assets/profile.png')} style={{ width: 69, height: 69, }} />
                      :
                      <Image source={{ uri: profile_photo_path }} style={{ width: 69, height: 69, }} />
                  }
                </View>
                <TouchableOpacity
                  onPress={pickImage}
                  style={{ marginRight: 30, borderColor: Colors.separator, borderWidth: 2, borderRadius: 100, paddingHorizontal: 20, paddingVertical: 10 }}
                >
                  <Text style={{ color: Colors.textPrimary, fontSize: 14, fontWeight: "400", marginHorizontal: 20 }}>{languageData.chooseImage}</Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 50, }}>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ marginVertical: 10, color: Colors.textSecondary, fontSize: 14, fontWeight: "400", textAlign: 'right' }}>{languageData.username}</Text>
                  <TextInput
                    placeholder='Name'
                    value={name}
                    onChangeText={(e) => setName(e)}
                    style={{ width: '100%', color: Colors.textPrimary, fontSize: 18, fontWeight: "400", textAlign: 'right' }}
                  />
                </View>
                <View style={{ marginVertical: 10, height: 2, backgroundColor: Colors.separator }}></View>
              </View>
              <View style={{ marginTop: 0 }}>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ marginVertical: 10, color: Colors.textSecondary, fontSize: 14, fontWeight: "400", textAlign: 'right' }}>{languageData.first_name}</Text>
                  <TextInput
                    placeholder='****'
                    value={firstName}
                    onChangeText={(e) => setFirstName(e)}
                    style={{ width: '100%', color: Colors.textPrimary, fontSize: 18, fontWeight: "400", textAlign: 'right' }}
                  />
                </View>
                <View style={{ marginVertical: 10, height: 2, backgroundColor: Colors.separator }}></View>
              </View>
              <View style={{ marginTop: 0 }}>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ marginVertical: 10, color: Colors.textSecondary, fontSize: 14, fontWeight: "400", textAlign: 'right' }}>{languageData.last_name}</Text>
                  <TextInput
                    placeholder='*****'
                    value={lastName}
                    onChangeText={(e) => setLastName(e)}
                    style={{ width: '100%', color: Colors.textPrimary, fontSize: 18, fontWeight: "400", textAlign: 'right' }}
                  />
                </View>
                <View style={{ marginVertical: 10, height: 2, backgroundColor: Colors.separator }}></View>
              </View>
              <View style={{ marginTop: 0 }}>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ marginVertical: 10, color: Colors.textSecondary, fontSize: 14, fontWeight: "400", textAlign: 'right' }}>{languageData.email}</Text>
                  <TextInput
                    placeholder='*****'
                    value={email}
                    onChangeText={(e) => setEmail(e)}
                    style={{ width: '100%', color: Colors.textPrimary, fontSize: 18, fontWeight: "400", textAlign: 'right' }}
                  />
                </View>
                <View style={{ marginVertical: 10, height: 2, backgroundColor: Colors.separator }}></View>
              </View>
              <View style={{ marginTop: 0 }}>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ marginVertical: 10, color: Colors.textSecondary, fontSize: 14, fontWeight: "400", textAlign: 'right' }}>{languageData.bio}</Text>
                  <TextInput
                    placeholder='*****'
                    multiline
                    numberOfLines={4}
                    value={bio}
                    onChangeText={(e) => setBio(e)}
                    style={{ width: '100%', color: Colors.textPrimary, fontSize: 18, fontWeight: "400", textAlign: 'right' }}
                  />
                </View>
                <View style={{ marginVertical: 10, height: 2, backgroundColor: Colors.separator }}></View>
              </View>
                <TouchableOpacity
                  onPress={fetchUpdateProfile} 
                  style={{ marginTop: 20, borderColor: Colors.separator, borderWidth: 2, borderRadius: 100, paddingHorizontal: 20, paddingVertical: 10 }}
                >
                  <Text style={{ color: Colors.textPrimary, fontSize: 13, fontWeight: '400', textAlign: 'center' }}>{languageData.edit_your_profile}</Text>
                </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}
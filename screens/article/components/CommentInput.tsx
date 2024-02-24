import { useColors } from '@context/ThemeContext';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import Api from '@utils/Api';
import axios from 'axios';
import { useToken } from '@context/AuthContext';
import { SuccessLoader } from '@components/SuccessLoader';
import { Routes } from '@utils/Routes';
import { LoginScreen } from '@screens/auth/Login';
import { useBottomSheet } from '@context/BottomSheetContext';

export const CommentInput = ({ route, slug, onAdd }) => {
  const { openBottomSheet } = useBottomSheet()
  const { token } = useToken();
  const [comment, setComment] = useState('');
  const [height, setHeight] = useState(40);
  const [countDown, setCountDown] = useState(0);

  const [isFetching, setIsFetching] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const { Colors } = useColors();
  const [limitColor, setLimitColor] = useState(Colors.textSecondary);
  
  const maxLength = 700;

  const styles = StyleSheet.create({
    container: {
      flex: 1, padding: 20, justifyContent: 'center',
    },
    label: {
      fontSize: 18, marginBottom: 10, color: Colors.separator,
    },
    textArea: {
      minHeight: 40, borderColor: Colors.separator, borderWidth: 1, borderRadius: 8,
      paddingHorizontal: 10, paddingTop: 10, paddingBottom: 10,
      backgroundColor: Colors.backgroundLight, fontSize: 16, color: Colors.textSecondary,
    },
    charCounter: {
      textAlign: 'right', marginTop: 8, fontSize: 12, color: limitColor,
    },
  });

  const handleOnChange = (e) => {
    setComment(e);

    if (e.length >= maxLength) {
      return setLimitColor(Colors.textDanger)
    }
    if (e.length > maxLength / 3 * 2) {
      return setLimitColor(Colors.textWarning)
    }
    return setLimitColor(Colors.textSecondary)
  }


  const postComment = async () => {
    if(token == null) {
      openBottomSheet(<LoginScreen />)
    }
    if (comment === '' || countDown !== 0) return;

    setIsButtonDisabled(true);
    setIsFetching(true);

    try {
      const apiUrl = Api.base + Api.article + slug + Api.comments;
      const response = await axios.post(apiUrl, {
        comment: comment,
      },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });
      const data = response.data;
      setIsFetching(false);
      setComment(''); 
      startTimer();  
      onAdd(data.comment);

    } catch (error) {
      setIsFetching(false);
      console.error('Error fetching data: ', error.response.data);
    } finally {
      setIsFetching(false);
    }
  }

  const startTimer = () => {
    setIsButtonDisabled(true);
    setCountDown(60);
    const timer = setInterval(() => {
      setCountDown(prevCountDown => {
        if (prevCountDown <= 1) {
          clearInterval(timer);
          setIsButtonDisabled(false);
          return 0;
        }
        return prevCountDown - 1;
      });
    }, 1000);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', }}>
          <View style={{ flex: 1 }}>
            <TextInput
              style={styles.textArea}
              placeholder="What are your thoughts"
              placeholderTextColor={Colors.textSecondary}
              multiline={true}
              maxLength={maxLength}
              onChangeText={handleOnChange}
              value={comment}
              onContentSizeChange={(e) => {
                setHeight(e.nativeEvent.contentSize.height);
              }}
            />
            <Text style={[styles.charCounter]}>
              {comment.length}/{maxLength}
            </Text>
          </View>
          <View style={{marginLeft: 10}}>
            <View
              style={{ width: 40, height: 40, opacity: comment == '' ? 0.5 : 1, backgroundColor: Colors.textSuccess, padding: 5, borderRadius: 7,  }}
            >
              {
                isFetching
                  ?
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator
                      animating={true}
                      size={20}
                      color={'white'}
                    />

                  </View>
                  :
                  countDown == 0 &&
                  <TouchableOpacity
                    onPress={postComment}
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <MaterialIcons
                      name='add'
                      size={30}
                      color='white'
                    />
                  </TouchableOpacity>
              }
            </View>
            <View style={{width: 40, marginTop: 7}}>
              <Text style={{color: Colors.textSecondary, textAlign: 'center'}}>{ countDown == 0 ? '' : countDown }</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};




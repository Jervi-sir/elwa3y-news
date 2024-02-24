import { View, Text, TouchableOpacity, Image, Dimensions, TextInput, Alert } from 'react-native';
import { useColors } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useToken } from '@context/AuthContext';
import Api from '@utils/Api';
import { useArticle } from '../ArticleContext';

export const CommentSingle = ({ route, item }) => {
  const { onDecreaseNbCommentsRoute } = route.params;

  const { onDecreaseNbComments } = useArticle();

  const { Colors } = useColors();
  const { languageData } = useLanguage();
  const { token } = useToken();
  const [isRemoved, setIsRemoved] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(item.comment);

  const handleEditDone = () => {
    setIsEditing(false);
    // Consider adding a debouncing mechanism or other logic to prevent exhausting the API
    // Call your API to update the comment here
  };

  const handleSave = async () => {
    try {
      const apiUrl = Api.base + Api.editComment + item.id;
      const response = await axios.post(apiUrl, {
        newComment: editedComment,
      },
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      if (response.status === 200) {
        setIsEditing(false);
      } else {
        console.error('Error updating comment:', response.data);
      }
    } catch (error) {
      console.error('Axios error:', error);
    }
  };

  const deleteAlert = () => {
    Alert.alert(
      '',
      languageData.confirm_delete,
      [
        {
          text: languageData.cancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: languageData.yes,
          onPress: () => handleDelete(),
          style: 'destructive',
        },
        
      ],
      {
        cancelable: true,
      }
    );
  };

  const handleDelete = async () => {
    try {
      const apiUrl = Api.base + Api.removeComment + item.id;
      const response = await axios.post(apiUrl, {
        newComment: editedComment,
      },
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      if (response.status === 200) {
        setIsEditing(false);
        setIsRemoved(true);
        onDecreaseNbComments();
        onDecreaseNbCommentsRoute();
      } else {
        console.error('Error updating comment:', response.data);
      }
    } catch (error) {
      console.error('Axios error:', error);
    }
  }

  useEffect(() => {
    setEditedComment(item.comment)
  }, [])


  return (
    <>
    {
      isRemoved
      ?
        null
      :
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {
              item.user_pic != null
              ?
              <Image source={require('@assets/profile.png')} style={{width: 31, height: 31, borderRadius: 100}} />
              :
              <Image source={{ uri: item.user_pic }} style={{width: 31, height: 31, borderRadius: 100}} />
            }
            <View style={{ marginLeft: 15, justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 15, fontWeight: '500', color: Colors.textSecondary }}>{ item.user_name }</Text>
              {/*
              <Text style={{ fontSize: 11, fontWeight: '400', color: Colors.textSecondary }}>{ TimeAgo(item.timestamp) } (edited)</Text>
               */}
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          {item.is_mine && !isEditing &&
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={{color: Colors.textSecondary, textDecorationLine: 'underline'}}>{ languageData.edit }</Text>
            </TouchableOpacity>
          }
          
          {isEditing &&
          <>
            <TouchableOpacity onPress={deleteAlert}>
              <Text style={{color: Colors.textDanger, textDecorationLine: 'underline'}}>{ languageData.delete }</Text>
            </TouchableOpacity>
            <View style={{width: 20}}></View>
            <TouchableOpacity onPress={handleSave}>
              <Text style={{color: Colors.textSuccess, textDecorationLine: 'underline'}}>{ languageData.save }</Text>
            </TouchableOpacity>
            
          </>
          }
        </View>
        </View>
        <View style={{ marginVertical: 20 }}>
          {isEditing ? (
            <TextInput
              style={{ fontSize: 13, fontWeight: '400', color: Colors.textPrimary, textAlign: 'right' }}
              value={editedComment}
              onChangeText={setEditedComment}
              autoFocus={true}
            />
          ) : (
            <Text style={{ fontSize: 13, fontWeight: '400', color: Colors.textPrimary, textAlign: 'right' }}>
              {editedComment}
            </Text>
          )}
        </View>
        {/**
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginRight: 4}}
        >
          <View
            style={{ flexDirection: 'row', alignItems: 'center'}}
          >
            <AntDesign
              name="like2"
              size={20}
              color={Colors.iconActive}
              style={{transform: [{ scaleX: -1 }]}}
            />
            <Text style={{ color: Colors.textPrimary, marginHorizontal: 4, fontSize: 12 }}></Text>
          </View>
        </View>
        */}
        <View style={{ marginTop: 10, height: 2, backgroundColor: Colors.separator }}></View>
        
      </View>
      }
    </>
  )
}
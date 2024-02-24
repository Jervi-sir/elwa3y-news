import { View, Text, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native'
import { useColors } from '@context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@utils/Routes';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { removeBookmarkedArticle } from 'functions/db';
import { useBookmarks } from '@context/BookmarkContext';

const { width } = Dimensions.get('window');

export const CardSingleOffline = ({ item }) => {
  const [isBookmarked, setIsBookmarked] = useState(1);
  const { Colors } = useColors();
  //const {anUpdateGotApplied, triggetAnUpdate} = useUpdate();
  const navigation = useNavigation();
  const data = item;
  const article = {
    id: data.id,
    slug: data.slug,
    thumbnail: data.thumbnail,
    category: data.category,
    title: data.title,
    recap: data.recap,
    duration: data.duration,
    uploaded_since: data.uploaded_since,
    nb_seen: data.nb_seen,
    likes: data.nb_likes,
    nb_comments: data.nb_comments,
  }

  const goToArticle = (article_id) => {
    navigation.navigate(Routes.ArticleOffline, { article_id: article_id });
  };

 

  return (
    <>
      <View style={{ marginTop: 10 }}>
        <TouchableOpacity
          onPress={() => goToArticle(article.id)}
          activeOpacity={0.95}
        >
          <View style={{ width: (width - 40), height: (width - 60), borderRadius: 10, overflow: 'hidden' }}>
            <Image source={{ uri: article.thumbnail }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
          </View>
          <Text style={{ marginTop: 10, color: Colors.textSecondary, fontSize: 20, fontWeight: '700' }}>{ article.title }</Text>
          <Text style={{ marginTop: 10, color: Colors.textSecondary, fontSize: 15, fontWeight: '300' }}>{ article.recap }</Text>
          <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
            <Image source={require('@assets/star.png')} style={{ width: 15, height: 15, marginRight: 15 }} />

            <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>{ article.category }</Text>
            <Text style={{ color: Colors.textSecondary, fontSize: 12, marginHorizontal: 20 }}>{ article.duration } read</Text>
            <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>{ article.uploaded_since }</Text>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <UnBook article={article} />
            </View>
          </View>
        </TouchableOpacity>
        <View style={{marginTop: 10, height: 2, backgroundColor: Colors.separator}}></View>
      </View>
    </>
  )
}

const UnBook = ({ article }) => {
  const { removeBookmark } = useBookmarks();
  const [isBookmarked, setIsBookmarked] = useState(true);
  const { Colors } = useColors();

  const handleBookmarkArticle = () => {
    removeBookmark(article.id, (isSuccessful) => {
      if (isSuccessful) {
        setIsBookmarked(false)
      } else {
        setIsBookmarked(true)
      }
    });
  }

  return (
    <TouchableOpacity
      onPress={() => handleBookmarkArticle()}
      style={{ marginLeft: 40 }}
    >
      <MaterialCommunityIcons
          name="bookmark"
          size={20}
          color={Colors.iconActive}
        />
    </TouchableOpacity>
  )
}
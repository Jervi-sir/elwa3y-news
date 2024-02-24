import { useColors } from "@context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@utils/Routes";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { AntDesign, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useBookmarks } from "@context/BookmarkContext";

const { width } = Dimensions.get('window');

export const CardSingle = ({item}) => {
  const { Colors } = useColors();
	const navigation = useNavigation();

  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const [nbLikes, setNbLikes] = useState(item.nb_likes);
  const [nbComments, setNbComments] = useState(item.nb_comments);
  const [nbViews, setNbViews] = useState(item.views);

  const goToArticle = () => {
    setNbViews(nbViews+1);
    navigation.navigate(Routes.ArticleNavigation, { 
      slug: item.slug,
      onLiked: e => console.log('onLiked: ' + e),
      updateLikeCount: e => setNbLikes(e),
      onBookmarked: e => setIsBookmarked(e),
      onIncreaseNbCommentsRoute: e => setNbComments(nbComments + 1), 
      onDecreaseNbCommentsRoute: e => setNbComments(nbComments - 1),
    });
  };

  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const { addBookmark, checkArticleIsBookmarked, removeBookmark } = useBookmarks();
  const handleBookmark = () => {
    if(bookmarkLoading) return;
    if(isBookmarked) {
      setBookmarkLoading(true)
      removeBookmark(item.id, (isSuccessful) => {
        if (isSuccessful) {
          setIsBookmarked(false)
          setBookmarkLoading(false)
        } else {
          setIsBookmarked(true)
          setBookmarkLoading(false)
        }
      });
    }
    else {
      setBookmarkLoading(true)
      addBookmark(item, (success, error) => {
        if (success) {
          setIsBookmarked(true)
          setBookmarkLoading(false)
        } else {
          setIsBookmarked(false)
          setBookmarkLoading(false)
        }
      });
    }
  }

  useEffect(() => {
    checkArticleIsBookmarked(item.id, setIsBookmarked);
    setNbLikes(item.nb_likes);
    setNbComments(item.nb_comments);
    setNbViews(item.views);
  }, [item]);

  return (
    <>
    <View style={{ marginTop: 10 }}>
        <TouchableOpacity
          onPress={goToArticle}
          activeOpacity={0.95}
        >
          <View style={{ width: (width - 40), height: (width - 60), borderRadius: 10, overflow: 'hidden' }}>
            <Image source={{ uri: item.thumbnail }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
          </View>
          <Text style={{ marginTop: 10, color: Colors.textSecondary, fontSize: 20, fontWeight: '700', textAlign: 'right' }}>{ item.title }</Text>
          <Text style={{ marginTop: 10, color: Colors.textSecondary, fontSize: 15, fontWeight: '300', textAlign: 'right' }}>{ item.recap }</Text>
          <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{flexDirection: 'row'}}>
              <Image source={require('@assets/star.png')} style={{ width: 15, height: 15, marginRight: 15 }} />
              <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>{ item.category_name }</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{ color: Colors.textSecondary, fontSize: 12, marginHorizontal: 20 }}>{ item.duration } read</Text>
              <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>{ item.uploaded_since }</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View>
          <View style={{marginTop: 10, justifyContent: 'space-between', flexDirection: 'row', backgroundColor: Colors.background, borderRadius: 20, paddingVertical: 10, width: '100%' }}>
            <View style={{flexDirection: 'row',}}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}
                onPress={() => goToArticle(item.slug)}
              >
                <AntDesign
                  name="like2"
                  size={20}
                  color={Colors.iconActive}
                  style={{transform: [{ scaleX: -1 }]}}
                />
                <Text style={{ color: Colors.textPrimary, marginHorizontal: 10, fontSize: 12 }}>{ nbLikes }</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}
                onPress={() => goToArticle(item.slug)}
              >
                <MaterialCommunityIcons
                  name="comment-outline"
                  size={20}
                  color={Colors.iconActive}
                />
                <Text style={{ color: Colors.textPrimary, marginHorizontal: 10, fontSize: 12 }}>{ nbComments }</Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', alignItems: 'center',  }}> 
                <Feather 
                  name="eye"
                  size={20}
                  color={Colors.iconActive}
                />
                <Text style={{ color: Colors.textPrimary, marginHorizontal: 10, fontSize: 12 }}>{ nbViews } </Text>
              </View>

            </View>
            <TouchableOpacity 
              onPress={handleBookmark}
              style={{ marginLeft: 40 }}
            >
              {
                bookmarkLoading 
                ? (   //means is loading
                <ActivityIndicator
                  color={Colors.iconPrimary}
                  style={{ width: 25, height: 25 }}
                />
                )
                : (
                  isBookmarked
                  ? (
                    <MaterialCommunityIcons
                      name="bookmark"
                      size={25}
                      color={Colors.iconPrimary}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="bookmark-plus-outline"
                      size={25}
                      color={Colors.iconPrimary}
                    />
                  )
                )
              }

            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginTop: 10, height: 2, backgroundColor: Colors.separator}}></View>
      </View>
    </>
  )
}
import { useToken } from "@context/AuthContext";
import { useColors } from "@context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@utils/Routes";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { useBookmarks } from "@context/BookmarkContext";

export const CardHorizental = ({ item }) => {
  const { Colors } = useColors();
  const { token } = useToken();
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
  const { addBookmark, checkArticleIsBookmarked, removeBookmark, bookmarkCount } = useBookmarks();
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
  }, [item, bookmarkCount]);

  return (
    <>
      <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
        <TouchableOpacity
          onPress={() => goToArticle(item.slug)}
          style={{ flexDirection: 'row', justifyContent: 'space-between' }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ paddingBottom: 10, color: Colors.textPrimary, fontSize: 15, fontWeight: '600', textAlign: 'right' }}>{item.title}</Text>
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
              <Image source={require('@assets/star.png')} />
              <Text style={{ color: Colors.textPrimary, marginHorizontal: 10, fontSize: 12, fontWeight: "400" }}>{item.duration} read</Text>
              <Text style={{ color: Colors.textPrimary, fontSize: 12, fontWeight: "400" }}>{item.uploaded_since}</Text>
            </View>
          </View>
          <View>
            <Image source={{ uri: item.thumbnail }} style={{ marginLeft: 11, width: 100, height: 100, borderRadius: 10 }} />
          </View>
        </TouchableOpacity>
        <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ backgroundColor: Colors.tagBackground, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 }}>
            <Text style={{ color: Colors.textPrimary }}>{item.category_name}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {
              nbLikes > 0 && 
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign
                  name="like2"
                  size={20}
                  color={Colors.iconPrimary}
                  style={{ transform: [{ scaleX: -1 }], paddingLeft: 3  }}
                />
                <Text style={{ color: Colors.textSecondary }}>{nbLikes} </Text>
              </View>
            }
            {
              nbComments > 0 && 
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons
                  name="comment-text-outline"
                  size={20}
                  color={Colors.iconPrimary}
                  style={{ transform: [{ scaleX: -1 }], paddingLeft: 3  }}
                />
                <Text style={{ color: Colors.textSecondary }}>{nbComments} </Text>
              </View>
            }
            {
              <View style={{ flexDirection: 'row', alignItems: 'center',  }}> 
                <Feather
                  name="eye"
                  size={20}
                  color={Colors.iconPrimary}
                  style={{ transform: [{ scaleX: -1 }], paddingLeft: 3 }}
                />
                <Text style={{ color: Colors.textSecondary }}>{nbViews} </Text>
              </View>
            }
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
      </View>
      <View style={{ marginTop: 10, height: 2, width: '100%', backgroundColor: Colors.separator }}></View>
    </>
  )
}
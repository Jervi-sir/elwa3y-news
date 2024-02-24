import { useToken } from "@context/AuthContext";
import { useLanguage } from "@context/LanguageContext";
import { useColors } from "@context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Share, Text, TouchableOpacity, View } from "react-native"
import { useArticle } from "./ArticleContext";
import { GeneralSkeleton } from "@components/skeletons/GeneralSkeleton";
import ShakeAnimation from "@components/ShakeAnimation";
import { Octicons, AntDesign, Fontisto, Entypo, MaterialCommunityIcons } from 'react-native-vector-icons';
import { Routes } from "@utils/Routes";
import { useBookmarks } from "@context/BookmarkContext";
import axios from "axios";
import Api from "@utils/Api";
import * as Speech from 'expo-speech';
import { ArticleComponent } from "./ArticleComponent";
import { TextSkeleton } from "@components/skeletons/TextSkeleton";
import { ImageLargeSkeleton } from "@components/skeletons/ImageLargeSkeleton";
import { CardHorizental } from "@components/cards/CardHorizental";
import { useBottomSheet } from "@context/BottomSheetContext";
import { CommentList } from "./CommentList";
import { useCommentsBottomSheet } from "./CommentBottomSheetContext";

export const ArticleScreen = ({ route }) => {
  const { slug } = route.params;
  const navigation = useNavigation();

  const { Colors } = useColors();
  const { token } = useToken();
  const { languageData } = useLanguage();

  const {
    article, setArticle,
    articles, setArticles,
    comments, setComments,
    relatedPosts, setRelatedPosts,
    nbComments, setNbComments
  } = useArticle();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    try {
      const response = await axios.get(Api.base + (token !== null ? Api.authenticated : '') + Api.article + slug, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = response.data;
      //console.log(data)
      setArticles(data.articles);
      setArticle(data.articles[0]);
      setComments(data.comments);
      setRelatedPosts(data.relatedPosts);
      setIsRefreshing(false);
      setIsLoading(false)
      
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  }
  
  return (
    <>
      {/* Floating Action */}
      <View style={{ position: 'absolute', bottom: 40, zIndex: 999, width: '100%', alignItems: 'center' }}>
        <View style={{ width: '70%' }}>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row', backgroundColor: Colors.background, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, width: '100%' }}>
            <FloatingAction route={route} />
          </View>
        </View>
      </View>

      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <View style={{ marginBottom: 20, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
          <TouchableOpacity
            style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => navigation.goBack()}
          >
            <Fontisto
              name="angle-left"
              size={25}
              color={Colors.iconSecondary}
            />
          </TouchableOpacity>
          <TopSection />
        </View>

        <FlatList
          data={relatedPosts}
          progressViewOffset={10}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View>
              <CardHorizental item={item} />
            </View>
          )}
          ListHeaderComponent={() => (
            <>
              {
                isLoading
                  ?
                  <View style={{ paddingHorizontal: 20 }}>
                    <ArticleSkeleton />
                  </View>
                  :
                  <>
                    <ArticleComponent item={article} />
                    <View style={{ marginTop: 30, marginBottom: 15 }}>
                      <View style={{ height: 7, width: '100%', backgroundColor: Colors.separator }}></View>
                    </View>
                  </>
              }
              <Text style={{ color: Colors.textSecondary, fontSize: 17, paddingHorizontal: 20, textAlign: 'right' }}>{languageData.related_posts}</Text>
            </>
          )}
          ListFooterComponent={() => (
            <View style={{ marginHorizontal: 20 }}>
              <View style={{ width: '100%', backgroundColor: Colors.white }}>
                <Text style={{ textAlign: 'center' }}>Elwa3y</Text>
                <View style={{ height: 123, }}>
                </View>
              </View>
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[Colors.textSecondary, Colors.textSecondary]}
              progressBackgroundColor="transparent"
              tintColor={Colors.textSecondary}
              title="Get News..."
              titleColor={Colors.textSecondary}
            />
          }

        />
      </View>
    </>
  );
}


const ArticleSkeleton = () => {
  return (
    <>
      <ImageLargeSkeleton />
      <View style={{ flexDirection: 'row', }}>
        <View style={{ marginVertical: 20, width: 20, height: 10 }}><TextSkeleton /></View>
        <View style={{ marginVertical: 20, width: 69, height: 10, marginHorizontal: 20 }}><TextSkeleton /></View>
        <View style={{ marginVertical: 20, width: 69, height: 10 }}><TextSkeleton /></View>
      </View>
      <View style={{ marginVertical: 20, width: '69%', height: 20 }}><TextSkeleton /></View>
      <>
        <View style={{ marginVertical: 10, width: '100%', height: 10 }}><TextSkeleton /></View>
        <View style={{ marginVertical: 10, width: '80%', height: 10 }}><TextSkeleton /></View>
        <View style={{ marginVertical: 10, width: '70%', height: 10 }}><TextSkeleton /></View>
        <View style={{ marginVertical: 10, width: '50%', height: 10 }}><TextSkeleton /></View>
        <View style={{ marginVertical: 10, width: '20%', height: 10 }}><TextSkeleton /></View>
        <View style={{ marginVertical: 10, width: '10%', height: 10 }}><TextSkeleton /></View>
        <View style={{ marginVertical: 10, width: '10%', height: 10 }}><TextSkeleton /></View>
      </>
    </>
  )
}

const FloatingAction = ({ route }) => {
  const { onLiked, onBookmarked, updateLikeCount } = route.params;
  const { openCommentsBottomSheet } = useCommentsBottomSheet();

  const { article, nbComments, setNbComments } = useArticle();
  const { token } = useToken();
  const { Colors } = useColors();
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const { addBookmark, checkArticleIsBookmarked, removeBookmark } = useBookmarks();

  const [isLiked, setIsLiked] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [nb_likes, setNbLikes] = useState(0);
  const [shakeLikeButton, setShakeLikeButton] = useState(false);
  const handleLikes = async (article_id) => {
    if (cooldown) {
    setShakeLikeButton(true);
    return; // If on cooldown, ignore button presses
  }
  if (token) {
    setCooldown(true);  // Activate cooldown immediately when button is pressed
    try {
      let nbLikes = nb_likes;
      if (!isLiked) {
        setIsLiked(true);
        onLiked(true);

        nbLikes = nb_likes + 1;
        
        await axios.post(Api.base + Api.like + article_id, {}, { headers: { 'Authorization': 'Bearer ' + token } });
      } else {
        setIsLiked(false);
        onLiked(false);

        nbLikes = nb_likes - 1;
        await axios.post(Api.base + Api.unlike + article_id, {}, { headers: { 'Authorization': 'Bearer ' + token } });
      }
      setNbLikes(nbLikes);
      updateLikeCount(nbLikes)

      setTimeout(() => {
        setCooldown(false); // Clear cooldown after 1 second (or your desired duration)
      }, 2000);

    } catch (error) {
      console.error('Error fetching articles:', error);
      setIsLiked(!isLiked);
      setCooldown(false); // Clear cooldown in case of an error
    }
  } else {
    navigation.navigate(Routes.Login);
  }
  };

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const handleBookmark = () => {
    if(bookmarkLoading) return;
    if(isBookmarked) {
      setBookmarkLoading(true)
      removeBookmark(article?.id, (isSuccessful) => {
        if (isSuccessful) {
          setIsBookmarked(false)
          onBookmarked(false)
          setBookmarkLoading(false)
        } else {
          setIsBookmarked(true)
          onBookmarked(true)
          setBookmarkLoading(false)
        }
      });
    }
    else {
      setBookmarkLoading(true)
      addBookmark(article, (success, error) => {
        if (success) {
          setIsBookmarked(true)
          onBookmarked(true)
          setBookmarkLoading(false)
        } else {
          setIsBookmarked(false)
          onBookmarked(false)
          setBookmarkLoading(false)
        }
      });
    }
  }

  useEffect(() => {
    checkArticleIsBookmarked(article.id, setIsBookmarked);
    setIsLiked(article.isLiked);
    setNbLikes(article.nb_likes);
    setNbComments(article.nb_comments);
  }, [article]);

  return (
    <>
      {
        !article
          ?
          <View style={{ height: 20, width: '100%' }}>
            <GeneralSkeleton />
          </View>
          :
          <>
            <ShakeAnimation trigger={shakeLikeButton} updateSetError={setShakeLikeButton}>
              <TouchableOpacity
                onPress={() => handleLikes(article?.id)}
                style={{ flexDirection: 'row', alignItems: 'center' }}
                activeOpacity={0.7} // You can adjust this for a better visual feedback
              >
                <AntDesign
                  name={isLiked ? 'like1' : 'like2'}
                  size={25}
                  color={Colors.iconActive}
                  style={{ transform: [{ scaleX: -1 }] }}
                />
                <Text style={{ color: Colors.textPrimary, marginHorizontal: 10 }}>{nb_likes}</Text>
              </TouchableOpacity>
            </ShakeAnimation>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', }}
              onPress={() => {
                openCommentsBottomSheet(<CommentList route={route} />)
                //navigation.navigate(Routes.CommentList, { slug: article?.slug })
              }}
            >
              <MaterialCommunityIcons
                name="comment-outline"
                size={25}
                color={Colors.iconActive}
                style={{ transform: [{ scaleX: -1 }] }}
              />
              <Text style={{ color: Colors.textPrimary, marginHorizontal: 10 }}>{nbComments}</Text>
            </TouchableOpacity>
            {
              bookmarkLoading
              ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ActivityIndicator
                    color={Colors.iconActive}
                    style={{ width: 25, height: 25 }}
                  />
                </View>
              )
              : (
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={handleBookmark}
                >
                  {
                    isBookmarked 
                    ? (
                      <MaterialCommunityIcons
                        name="bookmark"
                        size={25}
                        color={Colors.iconActive}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="bookmark-plus-outline"
                        size={25}
                        color={Colors.iconActive}
                      />
                    )
                  }
                </TouchableOpacity>
              )
            }
          </>
      }
    </>
  )
}

const TopSection = () => {
  const { article } = useArticle();
  const { Colors } = useColors();
  const [isSharing, setIsSharing] = useState(false);

  const onShare = async (share) => {
    setIsSharing(true);
    try {
      const result = await Share.share({
        message: `${share.title}: ${share.url}`,
        title: share.title,

      }, {
        dialogTitle: 'Share Article',
        tintColor: 'white',
      });

      setIsSharing(false);
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          setIsSharing(false);
        } else {
          // shared
          setIsSharing(false);
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        setIsSharing(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <ReadingContent content={article?.content_text} />
      {
        isSharing
          ?
          <View style={{ marginHorizontal: 30, width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator
              color={Colors.iconSecondary}
              style={{ width: 25, height: 25 }}
            />
          </View>
          :
          <TouchableOpacity
            onPress={() => onShare({ title: article?.title, url: article?.slug })}
            style={{ marginHorizontal: 30, width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}
          >
            <Octicons
              name="share"
              size={25}
              color={Colors.iconSecondary}
            />
          </TouchableOpacity>
      }
      <TouchableOpacity style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
        <MaterialCommunityIcons
          name="dots-horizontal"
          size={25}
          color={Colors.iconSecondary}
        />
      </TouchableOpacity>
    </View>
  )
}

const ReadingContent = ({ content }) => {
  const { Colors } = useColors();
  /*----- Reading the Text ----*/
  const [isReading, setIsReading] = useState(0);  //0: not read and its in the start,   1: is reading,    2:paused
  const readOutloud = (content) => {
    //reading is in start
    if (isReading == 0) {
      Speech.speak(content, {
        language: 'ar',  // language tag in the IETF format
        pitch: 1.1,        // Pitch. 1.0 is the default.
        rate: 1.1,         // Rate. 1.0 is the default.
        onDone: () => {
          setIsReading(0);
          Speech.stop();
        }
      });
      return setIsReading(1);
    }
    //pause the reading
    if (isReading == 1) {
      Speech.pause();
      return setIsReading(2);
    }
    //resume the reading
    if (isReading == 2) {
      Speech.resume();
      return setIsReading(1);
    }
  }

  const pauseReading = () => {
    Speech.pause();
    setIsReading(2);
  }

  const resumeReading = () => {
    Speech.resume();
    setIsReading(1);
  }

  const resetReading = (content) => {
    //stop the reading completely
    setIsReading(1);
    Speech.stop();
    Speech.speak(content, {
      language: 'ar',  // language tag in the IETF format
      pitch: 1.1,        // Pitch. 1.0 is the default.
      rate: 1.1,         // Rate. 1.0 is the default.
      onDone: () => {
        setIsReading(0);
        Speech.stop();
      }
    });
  }

  const stopReading = () => {
    //stop the reading completely
    setIsReading(0);
    Speech.stop();
  }

  return (
    <View >
      {
        isReading == 0
          ?
          <TouchableOpacity
            onPress={() => readOutloud(content)}
            style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'flex-end' }}
          >
            <MaterialCommunityIcons
              name="headphones"
              size={25}
              color={Colors.iconSecondary}
            />
          </TouchableOpacity>
          :
          <View style={{ paddingHorizontal: 7, height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: Colors.backgroundWarning, borderRadius: 100, }}>
            {
              isReading == 1
                ?
                <TouchableOpacity
                  onPress={pauseReading}
                  style={{}}
                >
                  <MaterialCommunityIcons
                    name="motion-play"
                    size={25}
                    color={Colors.iconWarning}
                  />
                </TouchableOpacity>
                :
                <TouchableOpacity
                  onPress={resumeReading}
                  style={{}}
                >
                  <MaterialCommunityIcons
                    name="play-circle"
                    size={25}
                    color={Colors.iconSecondary}
                  />
                </TouchableOpacity>
            }
            <TouchableOpacity
              onPress={() => resetReading(content)}
              style={{ marginLeft: 10 }}
            >
              <MaterialCommunityIcons
                name="replay"
                size={25}
                color={Colors.iconSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={stopReading}
              style={{ marginLeft: 10 }}
            >
              <Entypo
                name="cross"
                size={25}
                color={Colors.iconSecondary}
              />
            </TouchableOpacity>
          </View>
      }
    </View>
  )
}
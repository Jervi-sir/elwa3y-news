import { CardSingleOffline } from '@components/offline/CardSingleOffline';
import { CardSingleSkeleton } from '@components/skeletons/CardSingleSkeleton';
import { Feather } from '@expo/vector-icons'
//import { clearCache, countBookmarkedArticles, deleteAllBookmarkedArticles, fetchBookmarkedArticles, getAllBookmarkedArticles } from '@functions/bookmark';
import Api from '@utils/Api';
import { useColors } from '@context/ThemeContext';
import axios from 'axios';
import { useEffect, useState, useRef, useCallback } from 'react'
import { View, Text, Alert, Animated, Easing, TouchableWithoutFeedback, Keyboard, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useLanguage } from '@context/LanguageContext';
import * as SQLite from 'expo-sqlite';

//import { useBookmark } from '@context/BookmarkContext';
import { CardHorizental } from '@components/cards/CardHorizental';
import { CardSingle } from '@components/cards/CardSingle';
import { countBookmarks, deleteBookmarksTable, fetchBookmarks } from 'functions/db';
import { useBookmarks } from '@context/BookmarkContext';

const HEADER_MAX_HEIGHT = 50;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export const SavedScreen = () => {

  const { Colors } = useColors();
  const { bookmarks, loadBookmarks, bookmarkCount, refreshBookmarks, clearAllBookmarksAndUpdateCount } = useBookmarks();
  const [refreshing, setRefreshing] = useState(false);

  const { languageData } = useLanguage();
  //const {anUpdateGotApplied, triggetAnUpdate} = useUpdate();

  //const [bookmarks, setBookmarks] = useState([]);
  const [data, setData] = useState([]);
  const [articleCount, setArticleCount] = useState(0);
  const [isDeleted, setIsDeleted] = useState(0);

  const [loadSkeleton, setLoadSkeleton] = useState(true);

  const [visible, setVisible] = useState(false);
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  const updateArticleCount = () => {
    countBookmarks((success, count) => {
      if (success) {
        setArticleCount(count);
      } else {
        console.error('Failed to count bookmarks');
      }
    });
  };

  const [offset, setOffset] = useState(0);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
  const limit = 7;  // Number of articles to fetch each time

  const handleLoadMore = useCallback(() => {
    if (isMoreDataAvailable) {
      const newOffset = offset + limit;
      loadBookmarks(false, newOffset, limit).then((newBookmarks) => {
        if (newBookmarks.length < limit) {
          setIsMoreDataAvailable(false); // No more bookmarks to load
        }
        setOffset(newOffset); // Update offset for next load
      });
    }
  }, [isMoreDataAvailable, loadBookmarks, offset, limit]);

  const loadData = useCallback(() => {
    setRefreshing(true);
    loadBookmarks(true); // Reset and load bookmarks
    setTimeout(() => {
      setRefreshing(false);
    }, 400); // Assuming fetching won't take longer than 1 second
  }, [loadBookmarks]);

  useEffect(() => {
    refreshList();
    setTimeout(() => {
      setLoadSkeleton(false)
    }, 400);
  }, []);

  const refreshList = () => {
    setRefreshing(true);
    refreshBookmarks().then(() => {
      setIsMoreDataAvailable(true); // Assuming refresh could add more bookmarks
      setOffset(0); // Reset offset after refresh
      setRefreshing(false);
    });
    refreshBookmarks(); // Directly call without chaining then()
    setTimeout(() => {
      setIsMoreDataAvailable(true); // Assuming refresh could add more bookmarks
      setOffset(0); // Reset offset after refresh
      setRefreshing(false);
    }, 1000); // Use a timeout to simulate wait time for async operations
  
  }

  const showConfirmation = () => {
    Alert.alert(
      "Confirm",
      languageData.confirmClearCache,
      [
        {
          text: languageData.yes, onPress: () => {
            clearAllBookmarksAndUpdateCount();
            /*deleteAllBookmarkedArticles(() => {
              setData([]); // Clear the current UI
              setArticleCount(0); // Reset the article count
              //resetBookmarkCount();
              clearCache();
            });*/
          },
        },
        {
          text: languageData.cancel,
          onPress: () => console.log("Cancel Pressed"),
        },
      ]
    );
  }

  const handlePress = () => {
    
  }

  const handleRefresh = () => {
    setRefreshing(true); // Show a loading indicator
    refreshBookmarks()
      .then(() => {
        console.log("Bookmarks refreshed successfully");
        // Perform any additional actions after the bookmarks have been refreshed
      })
      .catch(error => {
        console.error("Failed to refresh bookmarks", error);
        // Handle errors if needed
      })
      .finally(() => {
        setRefreshing(false); // Hide loading indicator
      });
  };

  const rotateAnim = useRef(new Animated.Value(0)).current; // Initial value for rotation: 0
  const startRotation = () => {
    rotateAnim.setValue(0); // Reset the animation value to 0
    Animated.timing(rotateAnim, {
      toValue: 1, // Animate to opacity: 1 (fully opaque)
      duration: 300, // 1000 milliseconds = 1 second
      easing: Easing.cubic, // Easing function to define curve
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  };
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'], // Rotate from 0 to 360 degrees
  });

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
          <View style={{ paddingHorizontal: 20 }}>
            <Animated.View style={{ backgroundColor: Colors.background, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 3, paddingBottom: 10 }}>
              <TouchableOpacity
                onPress={showConfirmation}
              >
                <Text style={{ color: Colors.textDanger, fontSize: 12, fontWeight: '500', textDecorationLine: 'underline'}}>{ languageData.deleteAll }</Text>
              </TouchableOpacity>
              <View style={{flexDirection: 'row-reverse', alignItems: 'center'}}>
                <TouchableOpacity 
                  onPress={() => {
                    startRotation()
                    refreshList()
                  }}
                  style={{paddingLeft: 10}}
                >
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Feather name="refresh-ccw" size={25} color={Colors.textPrimary} />
                  </Animated.View>
                </TouchableOpacity>

                <Text style={{ color: Colors.iconPrimary, fontSize: 25, fontWeight: '600' }}>{ languageData.saved }</Text>
                <Text style={{color: Colors.iconPrimary}}>( { bookmarkCount } ){' '}</Text>
                
              </View>
            </Animated.View>

            <View>
              {
                loadSkeleton
                  ?
                  <FlatList
                    data={[0, 1, 2, 3, 4]}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <View style={{ marginVertical: 10 }}>
                        <CardSingleSkeleton id={item} />
                      </View>
                    )}
                  />
                  :
                  <>
                  {
                    bookmarkCount === 0 
                    ?
                    <>
                      <Text style={{color: Colors.textPrimary, textAlign: 'center', fontSize: 20, fontWeight: '600', marginTop: 175}}>No Saved Articles</Text>
                      <TouchableOpacity
                        onPress={() => {loadData()
                          updateArticleCount();}
                          }
                      >
                        <Text style={{marginTop: 31,color: Colors.textPrimary, fontWeight: '600', textAlign: 'center'}}>Refresh</Text>
                      </TouchableOpacity>
                    </>
                    :
                    <FlatList
                      data={bookmarks}
                      showsVerticalScrollIndicator={false}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <View style={{ marginVertical: 10 }}>
                          <CardSingleOffline item={item} />
                        </View>
                      )}
                      ListFooterComponent={() => 
                        isMoreDataAvailable 
                        ? 
                        <ActivityIndicator size="large" color={Colors.textSecondary} /> 
                        : 
                        <View style={{ height: 200 }}></View>
                      }
                      onEndReached={handleLoadMore}
                      onEndReachedThreshold={0.5}
                      refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={handleRefresh}
                          colors={[Colors.textSecondary, Colors.textSecondary]}
                          progressBackgroundColor="transparent"
                          tintColor={Colors.textSecondary}
                          title="get News..."
                          titleColor={Colors.textSecondary}
                        />
                      }
                    />
                  }
                  </>
              }
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  )
}
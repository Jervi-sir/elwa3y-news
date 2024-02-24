import { useLanguage } from "@context/LanguageContext";
import { useColors } from "@context/ThemeContext";
import Api from "@utils/Api";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Easing, FlatList, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { ExploreSkeleton } from "./ExploreSkeleton";
import { CardSingle } from "@components/cards/CardSingle";

export const ExploreScreen = () => {
  const { Colors } = useColors();
  const { languageData } = useLanguage();

  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(1); // New state to track search result pagination

  const keywords = ['الجزائر', 'تحليل', 'إشاعات', 'عاجل', 'تقارير', 'حصري', 'آراء ', 'تفاعلي', '3اخر'];

  const [refreshing, setRefreshing] = useState(false);
  const [articles, setArticles] = useState([]);

  const [loadSkeleton, setLoadSkeleton] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    "current_page": null,
    "last_page": null,
    "per_page": null,
    "total": null
  });

  const fetchArticles = async (page = 1) => {
    setIsSearching(false);

    if (page === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const apiUrl = Api.base + Api.home + '?page=' + page;
      const response = await axios.get(apiUrl);
      const data = response.data;
      if (page === 1) {
        setArticles(data.recommendedArticles);
      } else {
        setArticles([...articles, ...data.recommendedArticles]);
      }
      setLoadSkeleton(false)
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  
  const fetchSearchResults = async (keyword = null, page = 1) => {
    setLoading(true);
    setIsSearching(true);
    if(keyword) { 
      setSearch(keyword); 
    }
    try {
      const apiUrl = Api.base + Api.search;
      //console.log(search);
      const response = await axios.get(apiUrl, {
        params: {
          keywords: keyword == null ? search : keyword,
          page: page
        }
      });
      const data = response.data;
      console.log(data);
      if (page === 1) {
        setArticles(data.articles);
      } else {
        setArticles([...articles, ...data.articles]);
      }

      setPagination(data.pagination);
      setSearchPage(page);

    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search) {
      fetchSearchResults();
    } else {
      fetchArticles();  // the function to fetch regular articles
    }
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && pagination.current_page < pagination.last_page) {
      const nextPage = pagination.current_page + 1;
      if (isSearching) {
        fetchSearchResults(nextPage);
      } else {
        fetchArticles(nextPage);
      }
    }
  };


  /*---Collapse --*/
  const HEADER_MAX_HEIGHT = 50;
  const HEADER_MIN_HEIGHT = 0;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const scrollY = useRef(new Animated.Value(0)).current;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
    easing: Easing.out(Easing.ease),
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false },
  );

  const handleScrollEndDrag = () => {
    const currentOffset = scrollY._value;
    const diff = currentOffset - (prevOffset);
    prevOffset = currentOffset;

    if (diff > 0) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  };

  let prevOffset = 0;

  return (
    <>
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <View style={{ paddingHorizontal: 20 }}>
          <Animated.View style={{ height: headerHeight, backgroundColor: Colors.background, flexDirection: 'row', alignItems: 'center', paddingLeft: 3, paddingBottom: 20 }}>
            <Text style={{ color: Colors.iconPrimary, fontSize: 25, fontWeight: '600', textAlign: 'left' }}>{languageData.explore}</Text>
          </Animated.View>
          <View style={{ height: 40, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.backgroundLight, borderRadius: 10, paddingHorizontal: 7, marginBottom: 10 }}>
            <TextInput
              placeholder={languageData.search}
              style={{ flex: 1, height: '100%', color: Colors.textPrimary, textAlign: 'right' }}
              placeholderTextColor={Colors.iconSecondary}
              value={search}
              onChangeText={(text) => {
                setSearch(text)
                //console.log('isSearching: ' + isSearching);
              }}
              onSubmitEditing={(text) => {
                //console.log('text: ' + text)
                fetchSearchResults()
              }}
              blurOnSubmit={true}
            />
            <View style={{ marginRight: 5, marginLeft: 10 }}>
              <AntDesign
                name='search1'
                size={20}
                color={Colors.iconSecondary}
              />
            </View>
          </View>
          <View>
            {
              loadSkeleton
                ?
                <ExploreSkeleton />
                :
                <FlatList
                  data={articles}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={{ marginVertical: 10 }}>
                      <CardSingle item={item} />
                    </View>
                  )}

                  ListFooterComponent={() => loadingMore
                    ?
                    (
                      <>
                        <ActivityIndicator size="small" />
                        <View style={{ height: 400 }}>
                        </View>
                      </>
                    )
                    :
                    <View style={{ height: 400 }}>
                    </View>
                  }
                  onEndReached={handleLoadMore}
                  onEndReachedThreshold={0.5}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={() => {
                        setRefreshing(true); // Indicate that refresh has started
                        if (!isSearching) {
                          // If not, refresh the general articles
                          return fetchArticles(1).finally(() => {
                            setRefreshing(false)
                            setSearchPage(1)
                          });
                        }
                        if (isSearching || search != '') {
                          // If in search mode, refresh the search results
                          return fetchSearchResults(1).finally(() => {
                            setRefreshing(false)
                            setSearchPage(1)
                          });
                        }

                      }}
                      colors={[Colors.textSecondary, Colors.textSecondary]}
                      progressBackgroundColor="transparent"
                      tintColor={Colors.textSecondary}
                      title="Get News..."
                      titleColor={Colors.textSecondary}
                    />
                  }
                  onScroll={handleScroll}
                  onScrollEndDrag={handleScrollEndDrag}
                  ListHeaderComponent={
                    <>
                      <ScrollView
                        horizontal
                        style={{ height: 40, marginTop: 20 }}
                      >
                        {keywords.map(keyword => (
                          <TouchableOpacity
                            onPress={() => {
                              fetchSearchResults(keyword = keyword);
                            }}
                            key={keyword}
                            style={{ height: 26, backgroundColor: Colors.tagBackground, borderRadius: 20, paddingHorizontal: 13, paddingVertical: 5, marginRight: 10 }}
                          >
                            <Text style={{ color: Colors.textPrimary }}>{keyword}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </>
                  }
                />
            }
          </View>

        </View>
      </View>
    </>
  )
}
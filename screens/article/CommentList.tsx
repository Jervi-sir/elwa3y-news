import { CommentSingle } from "@screens/article/components/CommentSingle";
import { useLanguage } from "@context/LanguageContext";
import { useColors } from "@context/ThemeContext";
import Api from "@utils/Api";
import axios from "axios";
import { useEffect, useState, useRef } from 'react'
import { View, Text, ScrollView, Animated, TextInput, TouchableWithoutFeedback, Keyboard, FlatList, ActivityIndicator, RefreshControl, Easing, Alert, TouchableOpacity } from 'react-native'
import { CommentInput } from "./components/CommentInput";
import { useToken } from "@context/AuthContext";
import { useArticle } from "./ArticleContext";

export const CommentList = ({ route }) => {
  const { slug, onIncreaseNbCommentsRoute } = route.params;
  
  const { comments, setComments, onIncreaseNbComments, onDecreaseNbComments } = useArticle();
  const { token } = useToken();
  const { Colors } = useColors();
  const { languageData } = useLanguage();

  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // New state to track if in search mode
  const [loadSkeleton, setLoadSkeleton] = useState(true);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    "current_page": null,
    "last_page": null,
    "per_page": null,
    "total": null
  });

  const fetchComments = async (page = 1) => {
    setIsSearching(false);
    if (page === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const response = await axios.get(Api.base + (token !== null ? Api.authenticated : '') + Api.article + slug + Api.comments + '?page=' + page, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = response.data;
      if (page === 1) {
        setComments(data.article_comments);
      } else {
        setComments([...comments, ...data.article_comments]);
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

  useEffect(() => {
    fetchComments(1);  // the function to fetch regular articles
  }, [token]);

  const handleLoadMore = () => {
    if (!loadingMore && pagination.current_page < pagination.last_page) {
      const nextPage = pagination.current_page + 1;
      fetchComments(nextPage);
    }
  };

  return (
    <>
      <View style={{ backgroundColor: Colors.background }}>
        <View style={{ paddingHorizontal: 10 }}>
          <View style={{ marginTop: 10, backgroundColor: Colors.background, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 10 }}>
            <Text style={{ color: Colors.textPrimary, fontSize: 22, fontWeight: '600', textAlign: 'center' }}>{languageData.comments}</Text>
          </View>
          <FlatList
            data={comments}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <>
                <CommentInput slug={slug} route={route} onAdd={(e) => { 
                  onIncreaseNbComments();
                  onIncreaseNbCommentsRoute();
                  setComments([e, ...comments]);
                 }}  />
              </>
            }
            renderItem={({ item }) => (
              <View style={{ marginVertical: 10 }}>
                <CommentSingle item={item} route={route} />
              </View>
            )}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true); // Indicate that refresh has started
                  if (!isSearching) {
                    // If not, refresh the general articles
                    return fetchComments(1).finally(() => {
                      setRefreshing(false)
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

          />
        </View>
      </View>
    </>
  )
}
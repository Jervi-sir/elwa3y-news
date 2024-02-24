import { CardHorizental } from "@components/cards/CardHorizental";
import { CardHorizentalSkeleton } from "@components/skeletons/CardHorizentalSkeleton";
import { useColors } from "@context/ThemeContext";
import Api from "@utils/Api";
import axios from "axios";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, View } from "react-native";
import { useM1Context } from "./M1Context";

export const CategoryScreen = ({ route }) => {
  const { category } = route.params;
  //const { articlesByCategory, updateArticlesForCategory } = useM1Context();
  const { Colors } = useColors();

  const [articles, setArticles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
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
    if (page === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const apiUrl = Api.base + Api.category + category + '?page=' + page;
      const response = await axios.get(apiUrl);
      const data = response.data;
      if (page === 1) {
        setArticles(data.recommendedArticles);
        //updateArticlesForCategory(category, data.recommendedArticles);
      } else {
        setArticles([...articles, ...data.recommendedArticles]);
        //updateArticlesForCategory(category, [...articles, ...data.recommendedArticles]);
      }
      setLoadSkeleton(false)
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && pagination.current_page < pagination.last_page) {
      fetchArticles(pagination.current_page + 1);
    }
  };

  const onRefresh = () => {
    setRefreshing(true); 
    setLoadSkeleton(true)
    setArticles([]);
    //updateArticlesForCategory(category, []);
    fetchArticles(1);
  };

  useEffect(() => {
    fetchArticles(1);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, flexDirection: 'column' }}>
      {
        loadSkeleton
        ?
        <ScrollView>
          <CardHorizentalSkeleton />
          <CardHorizentalSkeleton />
          <CardHorizentalSkeleton />
          <CardHorizentalSkeleton />
        </ScrollView>
        :
        <FlatList
          data={articles}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ marginVertical: 10 }}>
              <CardHorizental item={item} />
            </View>
          )}
          ListFooterComponent={() => loadingMore
            ?
            (
              <>
                <ActivityIndicator size="small" />
                <View style={{ height: 100 }}>
                </View>
              </>
            )
            :
            <View style={{ height: 111 }}>
            </View>
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.textSecondary, Colors.textSecondary]}
              progressBackgroundColor="transparent"
              tintColor={Colors.textSecondary}
              title="Get News..."
              titleColor={Colors.textSecondary}
            />
          }
        />
      }
    </View>
  )
}
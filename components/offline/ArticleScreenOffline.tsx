import { View, Text, Image, TouchableOpacity, Share, RefreshControl, Dimensions, ScrollView } from 'react-native';
import { FlatList } from 'react-native';
import { useColors } from '@context/ThemeContext';
import RenderHTML from 'react-native-render-html';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';

import { Fontisto, Octicons, MaterialCommunityIcons } from 'react-native-vector-icons'
import { fetchBookmarkedArticleById } from 'functions/db';

const { width } = Dimensions.get('window');

export const ArticleScreenOffline = ({ route }) => {
  const { article_id } = route.params;
  const [item, setItem] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigation = useNavigation();
  const { Colors } = useColors();

  const fetchData = async () => {
    setIsRefreshing(true);
    fetchBookmarkedArticleById(article_id, (success, article) => {
      if (success && article) {
        setItem(article);
        console.log(article)
      } else {
        console.log('Failed to fetch the article or article not found');
      }
      setIsRefreshing(false);
    });

  }
  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData()//.then(() => setIsRefreshing(false));
  }




  return (
    <View style={{backgroundColor: Colors.background}}>
      <View style={{ marginBottom: 20, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
        <TopSection article={item} />
      </View>
      <ScrollView>
        <View>
          <ArticleBody item={item} />
        </View>
        <View style={{ marginHorizontal: 20 }}>
          <View style={{ width: '100%', backgroundColor: Colors.white }}>
            <View style={{ height: 69, }}></View>
            <Text style={{ textAlign: 'center', color: Colors.textPrimary }}>Elwa3y</Text>
            <View style={{ height: 123, }}></View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const TopSection = ({ article }) => {
  const navigation = useNavigation();
  const { Colors } = useColors();

  const onShare = async (share) => {
    try {
      const result = await Share.share({
        message: `${share.title}: ${share.url}`,
        title: share.title,

      }, {
        dialogTitle: 'Share Article',
        tintColor: 'white',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  return (
    <>
      <TouchableOpacity
        style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}
        onPress={() => navigation.goBack()}
      >
        <Fontisto
          name="angle-down"
          size={25}
          color={Colors.iconSecondary}
        />
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}
        >
          <MaterialCommunityIcons
            name="headphones"
            size={25}
            color={Colors.iconSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginHorizontal: 30, width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
          <Octicons
            name="share"
            size={25}
            color={Colors.iconSecondary}
            onPress={() => onShare({ title: item.title, url: item.slug })}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={25}
            color={Colors.iconSecondary}
          />
        </TouchableOpacity>
      </View>
    </>
  )
}

const ArticleBody = ({ item }) => {
  const { Colors } = useColors();

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ width: (width - 40), height: (width - 60), borderRadius: 10, overflow: 'hidden' }}>
            <Image source={{ uri: item.thumbnail }} style={{ width: '100%', height: '100%' }} />
          </View>
          <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
            <Image source={require('@assets/star.png')} style={{ width: 15, height: 15, marginRight: 15 }} />
            <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>{item.category_name}</Text>
            <Text style={{ color: Colors.textSecondary, fontSize: 12, marginHorizontal: 20 }}>{item.duration} read</Text>
            <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>{item.uploaded_since}</Text>
          </View>
          <Text style={{ marginTop: 20, fontSize: 25, fontWeight: "800", color: Colors.textSecondary }}>{item.title}</Text>
        </View>
        <View style={{ marginTop: 15, paddingHorizontal: 20 }}>
          <RenderHTML
            contentWidth={100}
            source={{ html: item.content }}
            baseStyle={{ color: Colors.textPrimary }}
            tagsStyles={{
              h1: { padding: 0, margin: 0, marginBottom: 2 },
              h2: { padding: 0, margin: 0, marginBottom: 2 },
              h3: { padding: 0, margin: 0, marginBottom: 2 },
              h4: { padding: 0, margin: 0, marginBottom: 2 },
              h5: { padding: 0, margin: 0, marginBottom: 2 },
              p: { padding: 0, margin: 0, marginBottom: 2 }
            }}
          />
          <RenderHTML
            contentWidth={100}
            source={{ html: item.content }}
            baseStyle={{ color: Colors.textPrimary }}
            tagsStyles={{
              h1: { padding: 0, margin: 0, marginBottom: 2 },
              h2: { padding: 0, margin: 0, marginBottom: 2 },
              h3: { padding: 0, margin: 0, marginBottom: 2 },
              h4: { padding: 0, margin: 0, marginBottom: 2 },
              h5: { padding: 0, margin: 0, marginBottom: 2 },
              p: { padding: 0, margin: 0, marginBottom: 2 }
            }}

          />
        </View>
      </View>
    </>
  )
}
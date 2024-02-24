import { View, FlatList, Text, TouchableOpacity, RefreshControl, Image, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useColors } from '@context/ThemeContext';;
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { getNotifications, markNotificationAsRead, removeAllNotification, removeNotification } from 'notifications/notificationsDB';
import { TimeAgo, timeSince } from 'functions/helpers';
import { Routes } from '@utils/Routes';

import Swipeout from 'react-native-swipeout';
import { useLanguage } from '@context/LanguageContext';
import { useNotification } from 'notifications/NotificationContext';

export const NotificationScreen = () => {
  const { Colors } = useColors();
  const { languageData } = useLanguage();
  const { UnreadCount, setUnreadNotifications } = useNotification();
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isCleared, setIsCleared] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const newNotifications = await getNotifications(page, 10);
      if (newNotifications.length > 0) {
        if (page === 1) {
          setNotifications([]);
        }
        setNotifications((prevNotifications) => [...prevNotifications, ...newNotifications]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  }, [page]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setNotifications([]);
    setHasMore(true);
    await loadNotifications();
    setRefreshing(false);
  }, [UnreadCount]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications, UnreadCount]);

  const onDelete = (id) => {
    removeNotification(id);
    setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== id));
  }

  const clearAllNotificationConfirmation = () => {
    Alert.alert(
      languageData.warning,
      languageData.confirmClearCacheNotifications,
      [
        {
          text: languageData.cancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: languageData.yes,
          onPress: () => clearAllNotifications(),
          style: 'destructive',
        },
      ],
      {
        cancelable: true,
      }
    );
  };
  
  const clearAllNotifications = () => {
    removeAllNotification();
    setUnreadNotifications(0);
    navigation.goBack();
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: Colors.background, }}>
        <View style={{ marginHorizontal: 20 }}>
          <View style={{ position: 'relative', height: 30, marginBottom: 20, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={{ position: 'absolute', width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => navigation.goBack()}
            >
              <View style={{}}>
                <Fontisto
                  name="angle-left"
                  size={25}
                  color={Colors.iconSecondary}
                />
              </View>
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ color: Colors.textPrimary, fontSize: 17, fontWeight: '500' }}>{ languageData.Notifications }</Text>
            </View>
            <TouchableOpacity
              style={{position: 'absolute', right: 0}}
              onPress={clearAllNotificationConfirmation}
            >
              <Text style={{color: Colors.textDanger}}>{ languageData.clear_all }</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            bounces={false}
            renderItem={({ item }) => (
              <View style={{ marginVertical: 10 }}>
                <Notification item={item} onDelete={e => onDelete(e)} />
              </View>
            )}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[Colors.textSecondary, Colors.textSecondary]}
                progressBackgroundColor="transparent"
                tintColor={Colors.textSecondary}
                title="Get News..."
                titleColor={Colors.textSecondary}
              />
            }
            onEndReached={() => {
              if (hasMore) {
                loadNotifications();
              }
            }}
            ListFooterComponent={() =>
              <>
                <View style={{ height: 100 }}></View>
              </>
            }

          />
        </View>
      </View>
    </>
  )
}

const Notification = ({ item, onDelete }) => {
  const { Colors } = useColors();
  const navigation = useNavigation();
  const [isRead, setIsRead] = useState(false);
  const { decreaseUnreadCountBy } = useNotification();
  const slug = item.slug;

  useEffect(() => {
    setIsRead(item.isRead == 1 ? true : false);

  }, []);

  let swipeBtns = [{
    text: 'Delete',
    backgroundColor: 'red',
    underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
    onPress: () => { onDelete(item.id) }
  }];


  return (
    <Swipeout right={swipeBtns}
      autoClose='true'
      backgroundColor='transparent'>
      <TouchableOpacity
        onPress={() => {
          markNotificationAsRead(item.id);
          setIsRead(true);
          decreaseUnreadCountBy();
          navigation.navigate(Routes.ArticleNavigation, { slug });
        }}
        activeOpacity={0.95}
      >
        <View style={{ backgroundColor: !isRead ? Colors.backgroundLight : 'transparent', flexDirection: 'row', justifyContent: 'space-between', padding: 7, borderRadius: 10 }}>
          <View style={{ height: 69, width: 69, backgroundColor: Colors.backgroundLight, borderRadius: 7 }}>
            {
              item.thumbnail != null
              &&
              <Image source={{ uri: item.thumbnail }} style={{ width: '100%', height: '100%', borderRadius: 7 }} />
            }
          </View>
          <View style={{ alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: 5 }}>
            <Text style={{ color: Colors.textSecondary, fontSize: 17, }}>
              {item.title}
            </Text>
            <Text style={{ paddingTop: 7, color: Colors.iconSecondary }}>{TimeAgo(item.received_at)}</Text>
          </View>
        </View>
        <View style={{ marginVertical: 10, height: 2, backgroundColor: Colors.separator }}></View>
      </TouchableOpacity>
    </Swipeout>
  )
}
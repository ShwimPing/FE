import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, {Path} from 'react-native-svg';

type Bookmark = {
  bookMarkId: number;
  name: string;
  address: string;
  category: string;
  openTime: string;
  closeTime: string;
  rating: number;
  reviewCount: number;
};

const categoryMapToKorean: {[key: string]: string} = {
  TOGETHER: '기후동행쉼터',
  SMART: '스마트쉼터',
  HOT: '무더위쉼터',
  LIBRARY: '도서관쉼터',
  COLD: '한파쉼터',
  SUBWAY: '지하철역쉼터',
};

const categoryColors: {[key: string]: string} = {
  TOGETHER: '#E5F9EE',
  SMART: '#FDE6F4',
  HOT: '#E0F8F7',
  LIBRARY: '#E0F4FD',
  COLD: '#E8EAF6',
  SUBWAY: '#EDE7F6',
};

const MyBookmark = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastBookmarkId, setLastBookmarkId] = useState<number | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasNext, setHasNext] = useState(true);

  const fetchBookmarks = async (
    lastId: number | null,
    isRefreshing = false,
  ) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('인증 오류', '인증 토큰이 없습니다. 다시 로그인해 주세요.');
        return;
      }

      const response = await axios.get('http://211.188.51.4/mypage/bookmark', {
        params: {lastBookMarkId: lastId},
        headers: {Authorization: `Bearer ${token}`},
      });

      if (response.data && response.data.isSuccess && response.data.results) {
        const newBookmarks = response.data.results.bookMarkList;


        if (isRefreshing) {
          setBookmarks(newBookmarks);
        } else {
          setBookmarks(prevBookmarks => [...prevBookmarks, ...newBookmarks]);
        }

        if (newBookmarks.length > 0) {
          const newLastId = newBookmarks[newBookmarks.length - 1].bookMarkId;
          setLastBookmarkId(newLastId);
        } else {
          setHasNext(false);
        }

        setHasNext(response.data.results.hasNext);
      }
    } catch (error) {
      console.error('북마크 불러오기 오류:', error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBookmarks(0, true);
  }, []);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasNext && lastBookmarkId !== null) {
      setIsLoadingMore(true);
      fetchBookmarks(lastBookmarkId);
    }
  };

  const renderBookmark = ({item}: {item: Bookmark}) => {
    return (
      <View key={item.bookMarkId} style={styles.bookmarkContainer}>
        <View
          style={[
            styles.categoryBox,
            {backgroundColor: categoryColors[item.category] || '#f9f9f9'},
          ]}>
          <Text style={styles.categoryText}>
            {categoryMapToKorean[item.category]}
          </Text>
        </View>

        <Text style={styles.name}>{item.name}</Text>

        <View style={styles.ratingContainer}>
          <Svg width="14" height="13" viewBox="0 0 14 13" fill="none">
            <Path
              d="M6.99978 10.4246L10.0446 12.2662C10.6022 12.6037 11.2845 12.1048 11.1378 11.4738L10.3307 8.01082L13.0233 5.6777C13.5149 5.25217 13.2508 4.44511 12.6051 4.39375L9.06144 4.09294L7.67477 0.820713C7.42532 0.226429 6.57425 0.226429 6.32479 0.820713L4.93813 4.08561L1.39444 4.38642C0.748795 4.43778 0.484668 5.24483 0.976237 5.67036L3.66886 8.00348L2.86181 11.4665C2.71507 12.0974 3.39739 12.5963 3.95499 12.2588L6.99978 10.4246Z"
              fill="#FFD643"
            />
          </Svg>
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCountText}>({item.reviewCount})</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>{item.address}</Text>
          <Text style={styles.detailText}>|</Text>
          <Text style={styles.detailText}>
            {item.openTime}~{item.closeTime}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={bookmarks}
        renderItem={renderBookmark}
        keyExtractor={item => item.bookMarkId.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : null
        }
        contentContainerStyle={styles.listContentContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContentContainer: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  bookmarkContainer: {
    display: 'flex',
    padding: 12,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    alignSelf: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  categoryBox: {
    display: 'flex',
    height: 24,
    padding: 0,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    borderRadius: 2,
  },
  categoryText: {
    fontSize: 12,
    color: '#000',
  },
  name: {
    color: '#1A1A1B',
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 24,
  },
  ratingContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#1A1A1B',
    fontWeight: 'bold',
  },
  reviewCountText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#8E9398',
  },
  detailContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Pretendard-Bold',
    color: '#505458',
  },
  dot: {
    fontSize: 12,
    color: '#505458',
    marginHorizontal: 4,
  },
});

export default MyBookmark;

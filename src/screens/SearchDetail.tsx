/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import axios from 'axios';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage import

const categoryColors: {[key: string]: string} = {
  TOGETHER: '#F3F5F7',
  SMART: '#E5F9EE',
  HOT: '#E0F8F7',
  LIBRARY: '#E0F4FD',
  COLD: '#E8EAF6',
};

const categoryMapToKorean: {[key: string]: string} = {
  TOGETHER: '전체',
  SMART: '기후동행쉼터',
  HOT: '무더위쉼터',
  LIBRARY: '도서관쉼터',
  COLD: '한파쉼터',
};

interface PlaceDetail {
  placeId: number;
  name: string;
  address: string;
  openTime: string;
  closeTime: string;
  category: string;
  rating: number;
  isBookmarked: boolean;
}

interface Review {
  reviewId: number;
  writer: string;
  content: string;
  rating: number;
  date: string;
  reviewImageUrl: string;
}

const SearchDetail: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {placeId} = route.params as {placeId: number};

  const [placeDetail, setPlaceDetail] = useState<PlaceDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const fetchBookmarkStatus = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        Alert.alert('인증 오류', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }

      const response = await axios.get(
        `http://211.188.51.4/bookmarks/${placeId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      // console.log('Bookmark response:', response.data);

      if (response.data.isSuccess && response.data.results === '북마크 저장 성공') {
        setIsBookmarked(true);
      } else {
        setIsBookmarked(false);
      }
    } catch (error) {
      console.error('북마크 상태 가져오기 실패:', error);
      Alert.alert('북마크 상태를 가져오는 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    const fetchPlaceDetail = async () => {
      try {
        const response = await axios.get('http://211.188.51.4/places/detail', {
          params: {
            placeId,
          },
        });

        const {placeDetail, recentReviews} = response.data.results;
        setPlaceDetail(placeDetail);
        setReviews(recentReviews);
        fetchBookmarkStatus();
      } catch (error) {
        console.error('Error fetching place details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceDetail();
  }, [placeId]);

  const toggleBookmark = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        Alert.alert('인증 오류', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }

      const response = await axios.get(`http://211.188.51.4/bookmarks/${placeId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.isSuccess) {
        if (response.data.results === '북마크 저장 성공') {
          setIsBookmarked(true);
          // Alert.alert('북마크가 추가되었습니다.');
        } else if (response.data.results === '북마크 삭제 성공') {
          setIsBookmarked(false);
          // Alert.alert('북마크가 삭제되었습니다.');
        }
      } else {
        Alert.alert('북마크 처리 중 문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('북마크 처리 실패:', error);
      Alert.alert('북마크 처리 중 오류가 발생했습니다.');
    }
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!placeDetail) {
    return (
      <View style={styles.errorContainer}>
        <Text>장소 정보를 불러오는 데 실패했습니다.</Text>
      </View>
    );
  }

  const renderStars = (rating: number) => {
    const filledStars = Math.floor(rating);
    const emptyStars = 5 - filledStars;

    return (
      <View style={styles.starContainer}>
        {[...Array(filledStars)].map((_, index) => (
          <Svg
            key={`filled-${index}`}
            width="26"
            height="24"
            viewBox="0 0 26 24"
            fill="none">
            <Path
              d="M13 20.0993L19.0896 23.7824C20.2048 24.4574 21.5694 23.4595 21.2759 22.1976L19.6618 15.2716L25.0471 10.6054C26.0302 9.75433 25.502 8.14023 24.2107 8.03751L17.1233 7.43589L14.35 0.891426C13.8511 -0.297142 12.1489 -0.297142 11.65 0.891426L8.87669 7.42122L1.7893 8.02284C0.498017 8.12555 -0.0302359 9.73966 0.952901 10.5907L6.33814 15.257L4.72404 22.1829C4.43056 23.4449 5.79522 24.4427 6.91042 23.7677L13 20.0993Z"
              fill="#FFD643"
            />
          </Svg>
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <Svg
            key={`empty-${index}`}
            width="26"
            height="24"
            viewBox="0 0 26 24"
            fill="none">
            <Path
              d="M13 20.0993L19.0896 23.7824C20.2048 24.4574 21.5694 23.4595 21.2759 22.1976L19.6618 15.2716L25.0471 10.6054C26.0302 9.75433 25.502 8.14023 24.2107 8.03751L17.1233 7.43589L14.35 0.891426C13.8511 -0.297142 12.1489 -0.297142 11.65 0.891426L8.87669 7.42122L1.7893 8.02284C0.498017 8.12555 -0.0302359 9.73966 0.952901 10.5907L6.33814 15.257L4.72404 22.1829C4.43056 23.4449 5.79522 24.4427 6.91042 23.7677L13 20.0993Z"
              fill="#E8E8E8"
            />
          </Svg>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View
          style={[
            styles.categoryBox,
            {
              backgroundColor:
                categoryColors[placeDetail.category] || '#F3F5F7',
            },
          ]}>
          <Text style={styles.categoryBoxText}>
            {categoryMapToKorean[placeDetail.category] || placeDetail.category}
          </Text>
        </View>

        <Text style={styles.placeName}>{placeDetail.name}</Text>

        <View style={styles.locationContainer}>
          <Svg width="16" height="17" viewBox="0 0 16 17" fill="none">
            <Path
              d="M7.99999 9.16659C9.10456 9.16659 9.99999 8.27115 9.99999 7.16659C9.99999 6.06202 9.10456 5.16659 7.99999 5.16659C6.89542 5.16659 5.99999 6.06202 5.99999 7.16659C5.99999 8.27115 6.89542 9.16659 7.99999 9.16659Z"
              stroke="#505458"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M7.99999 15.1666C10.6667 12.4999 13.3333 10.1121 13.3333 7.16659C13.3333 4.22107 10.9455 1.83325 7.99999 1.83325C5.05447 1.83325 2.66666 4.22107 2.66666 7.16659C2.66666 10.1121 5.33332 12.4999 7.99999 15.1666Z"
              stroke="#505458"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.address}>{placeDetail.address}</Text>
        </View>

        <View style={styles.openTimeContainer}>
          <Svg width="16" height="17" viewBox="0 0 16 17" fill="none">
            <Path
              d="M8.00001 4.49992V8.49992L10.6667 9.83325M14.6667 8.49992C14.6667 12.1818 11.6819 15.1666 8.00001 15.1666C4.31811 15.1666 1.33334 12.1818 1.33334 8.49992C1.33334 4.81802 4.31811 1.83325 8.00001 1.83325C11.6819 1.83325 14.6667 4.81802 14.6667 8.49992Z"
              stroke="#505458"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.openTime}>
            {placeDetail.openTime} - {placeDetail.closeTime}
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.reviewTitle}>리뷰</Text>

        <View style={styles.averageRatingContainer}>
          <Text style={styles.averageRatingText}>
            {placeDetail.rating.toFixed(1)}
          </Text>
          {renderStars(placeDetail.rating)}
        </View>

        {reviews.map(review => (
          <View key={review.reviewId} style={styles.reviewContainer}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewUser}>
                <Image
                  source={require('../../assets/images/profile.png')}
                  style={styles.profileImage}
                />
                <View>
                  <Text style={styles.userName}>{review.writer}</Text>
                  <View style={styles.userRating}>
                    {[...Array(5)].map((_, i) => (
                      <Svg
                        key={i}
                        width="14"
                        height="12"
                        viewBox="0 0 14 12"
                        fill="none">
                        <Path
                          d="M7.00003 10.0496L10.0448 11.8912C10.6024 12.2287 11.2847 11.7298 11.138 11.0988L10.331 7.63582L13.0236 5.3027C13.5151 4.87717 13.251 4.07011 12.6054 4.01875L9.06168 3.71794L7.67502 0.445713C7.42556 -0.148571 6.57449 -0.148571 6.32504 0.445713L4.93837 3.71061L1.39468 4.01142C0.749039 4.06278 0.484913 4.86983 0.976481 5.29536L3.6691 7.62848L2.86205 11.0915C2.71531 11.7224 3.39764 12.2213 3.95524 11.8838L7.00003 10.0496Z"
                          fill={i < review.rating ? '#FFD643' : '#E8E8E8'}
                        />
                      </Svg>
                    ))}
                  </View>
                </View>
              </View>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            <Text style={styles.reviewContent}>{review.content}</Text>
            {review.reviewImageUrl ? (
              <Image
                source={{uri: review.reviewImageUrl}}
                style={styles.reviewImage}
              />
            ) : null}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={toggleBookmark} style={styles.footerLeft}>
          <Svg width="34" height="35" viewBox="0 0 24 25" fill="none">
            <Path
              d="M5 8.425C5 6.74484 5 5.90476 5.32698 5.26303C5.6146 4.69854 6.07354 4.2396 6.63803 3.95198C7.27976 3.625 8.11984 3.625 9.8 3.625H14.2C15.8802 3.625 16.7202 3.625 17.362 3.95198C17.9265 4.2396 18.3854 4.69854 18.673 5.26303C19 5.90476 19 6.74484 19 8.425V21.625L12 17.625L5 21.625V8.425Z"
              stroke={isBookmarked ? '#000' : '#1A1A1B'}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={isBookmarked ? '#222' : 'none'}
            />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('ReviewForm', {placeId})}>
          <Text style={styles.footerButtonText}>리뷰 작성하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 120,
  },
  categoryBox: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 2,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  categoryBoxText: {
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    color: '#1A1A1B',
  },
  placeName: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    color: '#000',
    marginBottom: 4,
    lineHeight: 27,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  address: {
    marginLeft: 4,
    color: '#505458',
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    lineHeight: 21,
  },
  openTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  openTime: {
    marginLeft: 4,
    color: '#505458',
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    lineHeight: 21,
  },
  divider: {
    width: '100%',
    height: 10,
    backgroundColor: '#F8F9FA',
    marginBottom: 20,
  },
  reviewTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    lineHeight: 27,
    color: '#000',
    marginBottom: 8,
  },
  averageRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  averageRatingText: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    color: '#000',
    marginRight: 12,
  },
  starContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  reviewContainer: {
    marginBottom: 28,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 7,
  },
  userName: {
    fontSize: 14,
    color: '#505458',
    fontFamily: 'Pretendard-Bold',
    lineHeight: 18,
  },
  userRating: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    color: '#565656',
    lineHeight: 18,
  },
  reviewContent: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#000',
    lineHeight: 21,
    marginBottom: 7,
  },
  reviewImage: {
    height: 342,
    borderRadius: 5,
    backgroundColor: '#E8E8E8',
    marginBottom: 28,
  },
  reviewImagePlaceholder: {
    height: 342,
    borderRadius: 5,
    backgroundColor: '#E8E8E8',
    marginBottom: 28,
  },
  footer: {
    width: '100%',
    paddingTop: 24,
    paddingBottom: 46,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 23,
    backgroundColor: '#FFF',
  },
  footerLeft: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#8E9398',
    fontFamily: 'Pretendard-Regular',
    textAlign: 'center',
    marginTop: 4,
  },
  footerButton: {
    backgroundColor: '#222',
    width: 299,
    paddingVertical: 16,
    borderRadius: 10,
  },
  footerButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Pretendard-Bold',
    textAlign: 'center',
    lineHeight: 21,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchDetail;

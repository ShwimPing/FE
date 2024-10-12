import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import apiClient from '../../services/apiClient';

interface Review {
  reviewId: number;
  category: string;
  name: string;
  rating: number;
  content: string;
  reviewImageUrl: string | null;
  date: string;
}

const categoryColors: {[key: string]: string} = {
  TOGETHER: '#E5F9EE',
  SMART: '#FDE6F4',
  HOT: '#E0F8F7',
  LIBRARY: '#E0F4FD',
  COLD: '#E8EAF6',
};

const categoryMapToKorean: {[key: string]: string} = {
  TOGETHER: '기후동행쉼터',
  SMART: '스마트쉼터',
  HOT: '무더위쉼터',
  LIBRARY: '도서관쉼터',
  COLD: '한파쉼터',
};

const MyReview: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/mypage/review', {
        params: {lastReviewId: 0},
      });
      const newReviews = response.data.results.myReviewResponsesList || [];
      setReviews(newReviews);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : '리뷰를 불러오는 중 오류가 발생했습니다.',
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: number) => {
    try {
      await apiClient.delete(`/reviews/${reviewId}`);
      setReviews(prevReviews =>
        prevReviews.filter(review => review.reviewId !== reviewId),
      );
      Alert.alert('성공', '리뷰가 삭제되었습니다.');
    } catch (err) {
      Alert.alert(
        '오류',
        err instanceof Error
          ? err.message
          : '리뷰 삭제 중 오류가 발생했습니다.',
      );
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    const filledStars = Math.floor(rating);
    const emptyStars = 5 - filledStars;
    return (
      <View style={styles.starContainer}>
        {[...Array(filledStars)].map((_, index) => (
          <Svg
            key={`filled-${index}`}
            width="14"
            height="12"
            viewBox="0 0 14 12"
            fill="none">
            <Path
              d="M7.00003 10.0496L10.0448 11.8912C10.6024 12.2287 11.2847 11.7298 11.138 11.0988L10.331 7.63582L13.0236 5.3027C13.5151 4.87717 13.251 4.07011 12.6054 4.01875L9.06168 3.71794L7.67502 0.445713C7.42556 -0.148571 6.57449 -0.148571 6.32504 0.445713L4.93837 3.71061L1.39468 4.01142C0.749039 4.06278 0.484913 4.86983 0.976481 5.29536L3.6691 7.62848L2.86205 11.0915C2.71531 11.7224 3.39764 12.2213 3.95524 11.8838L7.00003 10.0496Z"
              fill="#FFD643"
            />
          </Svg>
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <Svg
            key={`empty-${index}`}
            width="14"
            height="12"
            viewBox="0 0 14 12"
            fill="none">
            <Path
              d="M7.00003 10.0496L10.0448 11.8912C10.6024 12.2287 11.2847 11.7298 11.138 11.0988L10.331 7.63582L13.0236 5.3027C13.5151 4.87717 13.251 4.07011 12.6054 4.01875L9.06168 3.71794L7.67502 0.445713C7.42556 -0.148571 6.57449 -0.148571 6.32504 0.445713L4.93837 3.71061L1.39468 4.01142C0.749039 4.06278 0.484913 4.86983 0.976481 5.29536L3.6691 7.62848L2.86205 11.0915C2.71531 11.7224 3.39764 12.2213 3.95524 11.8838L7.00003 10.0496Z"
              fill="#E8E8E8"
            />
          </Svg>
        ))}
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={
        reviews.length === 0 ? styles.emptyContainer : null
      }
      style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : reviews.length === 0 ? (
        <Text style={styles.noReviewsText}>아직 작성한 리뷰가 없어요</Text>
      ) : (
        reviews.map(review => (
          <View key={review.reviewId} style={styles.reviewContainer}>
            <View style={styles.headerRow}>
              <View
                style={[
                  styles.categoryBox,
                  {
                    backgroundColor:
                      categoryColors[review.category] || '#F3F5F7',
                  },
                ]}>
                <Text style={styles.categoryBoxText}>
                  {categoryMapToKorean[review.category] || review.category}
                </Text>
              </View>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>

            <View style={styles.placeAndDeleteRow}>
              <Text style={styles.placeName}>{review.name}</Text>
              <TouchableOpacity onPress={() => deleteReview(review.reviewId)}>
                <Text style={styles.deleteButton}>삭제</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.starsAndDeleteContainer}>
              {renderStars(review.rating)}
            </View>

            <Text style={styles.reviewContent}>{review.content}</Text>

            {review.reviewImageUrl && review.reviewImageUrl.trim() !== '' ? (
              <Image
                source={{uri: review.reviewImageUrl}}
                style={styles.reviewImage}
              />
            ) : null}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noReviewsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  reviewContainer: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  placeAndDeleteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoContainer: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewDate: {
    color: '#565656',
    fontFamily: 'Pretendard',
    fontSize: 12,
    lineHeight: 18,
  },
  deleteButton: {
    color: '#8E9398',
    fontFamily: 'Pretendard',
    fontSize: 12,
    textAlign: 'right',
    lineHeight: 18,
    textDecorationLine: 'underline',
  },
  starsAndDeleteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  reviewContent: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#000',
    lineHeight: 21,
    marginBottom: 7,
  },
  reviewImage: {
    width: '100%',
    height: 200,
    borderRadius: 7,
    marginTop: 8,
    backgroundColor: '#E8E8E8',
  },
  starContainer: {
    flexDirection: 'row',
  },
  categoryBox: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 2,
    alignSelf: 'flex-start',
  },
  categoryBoxText: {
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    color: '#1A1A1B',
  },
});

export default MyReview;

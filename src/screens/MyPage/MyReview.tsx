import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import apiClient from '../../services/apiClient';

interface Review {
  reviewId: number;
  writer: string;
  rating: number;
  content: string;
  reviewImageUrl: string | null;
  date: string;
}

const MyReview: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get('/mypage/review', {
        params: {
          lastReviewId: 0,
        },
      });

      const newReviews = response.data?.results?.reviewSimpleResponseList || [];
      setReviews(newReviews);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || '리뷰를 불러오는 중 오류가 발생했습니다.');
      } else {
        setError('리뷰를 불러오는 중 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: number) => {
    try {
      await apiClient.delete(`/reviews/${reviewId}`);

      setReviews((prevReviews) => prevReviews.filter((review) => review.reviewId !== reviewId));
      Alert.alert('성공', '리뷰가 삭제되었습니다.');
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert('오류', err.message || '리뷰 삭제 중 오류가 발생했습니다.');
      } else {
        Alert.alert('오류', '리뷰 삭제 중 알 수 없는 오류가 발생했습니다.');
      }
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
    <ScrollView contentContainerStyle={reviews.length === 0 ? styles.emptyContainer : null} style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : reviews.length === 0 ? (
        <Text style={styles.noReviewsText}>아직 작성한 리뷰가 없어요</Text>
      ) : (
        reviews.map((review) => (
          <View key={review.reviewId} style={styles.reviewContainer}>
            <View style={styles.rowContainer}>
              <Image
                source={require('../../../assets/images/profile.png')}
                style={styles.profileImage}
              />

              <View style={styles.infoContainer}>
                <View style={styles.nameAndDateContainer}>
                  <Text style={styles.userName}>{review.writer}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>

                <View style={styles.starsAndDeleteContainer}>
                  {renderStars(review.rating)}
                  <TouchableOpacity onPress={() => deleteReview(review.reviewId)}>
                    <Text style={styles.deleteButton}>삭제</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <Text style={styles.reviewContent}>{review.content}</Text>

            {review.reviewImageUrl && review.reviewImageUrl.trim() !== '' ? (
              <Image source={{ uri: review.reviewImageUrl }} style={styles.reviewImage} />
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
    fontFamily: 'Pretendard-Bold',
    color: '#000',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    color: 'red',
  },
  reviewContainer: {
    marginBottom: 24,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 7,
  },
  infoContainer: {
    flex: 1,
  },
  nameAndDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 12,
    fontFamily: 'Pretendard-Bold',
    color: '#505458',
  },
  reviewDate: {
    color: '#565656',
    fontFamily: 'Pretendard',
    fontSize: 12,
    fontWeight: '400',
  },
  starsAndDeleteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  starContainer: {
    flexDirection: 'row',
  },
  deleteButton: {
    color: '#565656',
    fontFamily: 'Pretendard',
    fontSize: 12,
    lineHeight: 18,
    borderBottomColor: '#222',
    borderBottomWidth: 1,
  },
  reviewContent: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Pretendard-Regular',
    lineHeight: 21,
  },
  reviewImage: {
    height: 342,
    borderRadius: 7,
    marginTop: 8,
  },
});

export default MyReview;

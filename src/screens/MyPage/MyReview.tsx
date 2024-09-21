import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import Svg, {Path} from 'react-native-svg';

const MyReview: React.FC = () => {
  const reviews = [
    {
      reviewId: 1,
      writer: '햄깅이',
      rating: 4,
      content: '생각보다 내부가 엄청 넓었어요. 쉬기 좋았어요!',
      reviewImageUrl: null,
    },
    {
      reviewId: 2,
      writer: '김밥이',
      rating: 5,
      content: '분위기 최고! 다음에 또 올 거에요.',
      reviewImageUrl: 'https://example.com/image2.jpg',
    },
  ];

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
      {reviews.length === 0 ? (
        <Text style={styles.noReviewsText}>아직 작성한 리뷰가 없어요</Text>
      ) : (
        reviews.map((review) => (
          <View key={review.reviewId} style={styles.reviewContainer}>
            <View style={styles.reviewHeader}>
              <View style={styles.userInfoContainer}>
                <Image
                  source={require('../../../assets/images/profile.png')}
                  style={styles.profileImage}
                />
                <View>
                  <Text style={styles.userName}>{review.writer}</Text>
                  {renderStars(review.rating)}
                </View>
              </View>

              <Text style={styles.deleteButton}>삭제</Text>
            </View>

            <Text style={styles.reviewContent}>{review.content}</Text>

            {review.reviewImageUrl ? (
              <Image source={{uri: review.reviewImageUrl}} style={styles.reviewImage} />
            ) : (
              <View style={styles.imagePlaceholder} />
            )}
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
  reviewContainer: {
    marginBottom: 24,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfoContainer: {
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
    fontSize: 12,
    fontFamily: 'Pretendard-Bold',
    color: '#505458',
    marginBottom: 2,
    lineHeight: 18,
  },
  starContainer: {
    flexDirection: 'row',
  },
  deleteButton: {
    color: '#565656',
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    lineHeight: 18,
    borderBottomColor: '#222',
    borderBottomWidth: 1,
  },
  reviewContent: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Pretendard-Regular',
    marginBottom: 8,
    lineHeight: 21,
  },
  reviewImage: {
    height: 342,
    borderRadius: 7,
    marginBottom: 12,
  },
  imagePlaceholder: {
    height: 342,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 12,
  },
});

export default MyReview;

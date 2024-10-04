/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import Svg, {Path} from 'react-native-svg';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'ReviewForm'>;

const ReviewForm: React.FC<Props> = () => {
  const [rating, setRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [ratingError, setRatingError] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const navigation = useNavigation();

  const route = useRoute();
  const {placeId} = route.params as {placeId: number};

  const handleRatingSelect = (value: number) => {
    setRating(value);
    setRatingError('');
  };

  const handleImagePick = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
    });

    if (result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!rating) {
      setRatingError('별점을 선택해주세요');
    }

    if (reviewText.trim() === '') {
      setReviewError('후기를 작성해주세요');
    } else if (reviewText.length > 500) {
      setReviewError('500자를 초과하였습니다');
    } else {
      setReviewError('');
    }

    if (rating && reviewText.trim() !== '' && reviewText.length <= 500) {
      const formData = new FormData();
      formData.append('reviewUploadRequest', JSON.stringify({
        placeId,
        rating,
        content: reviewText,
      }));

      if (selectedImage) {
        formData.append('file', {
          uri: selectedImage.uri,
          type: selectedImage.type,
          name: selectedImage.fileName,
        });
      }

      try {
        const token = await AsyncStorage.getItem('accessToken');

        if (!token) {
          Alert.alert('인증 오류', '로그인 후 다시 시도해 주세요.');
          return;
        }

        const response = await axios.post('http://211.188.51.4/reviews', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          Alert.alert('리뷰가 성공적으로 제출되었습니다.');
          setRating(null);
          setReviewText('');
          setSelectedImage(null);

          navigation.goBack();
        }
      } catch (error) {
        console.error('Error submitting review:', error);
        Alert.alert('리뷰 제출에 실패했습니다.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>방문 후기를 알려주세요!</Text>

      <View style={styles.starRatingContainer}>
        {[...Array(5)].map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleRatingSelect(index + 1)}>
            <Svg
              width="27"
              height="24"
              viewBox="0 0 27 24"
              fill="none">
              <Path
                d="M13.5001 20.0993L19.5896 23.7824C20.7048 24.4574 22.0695 23.4595 21.776 22.1976L20.1619 15.2716L25.5471 10.6054C26.5303 9.75433 26.002 8.14023 24.7107 8.03751L17.6234 7.43589L14.85 0.891426C14.3511 -0.297142 12.649 -0.297142 12.1501 0.891426L9.37675 7.42122L2.28936 8.02284C0.998078 8.12555 0.469825 9.73966 1.45296 10.5907L6.8382 15.257L5.2241 22.1829C4.93062 23.4449 6.29528 24.4427 7.41048 23.7677L13.5001 20.0993Z"
                fill={index < (rating || 0) ? '#FFD643' : '#E8E8E8'}
              />
            </Svg>
          </TouchableOpacity>
        ))}
      </View>

      {ratingError ? (
        <Text style={[styles.errorText, styles.caption]}>{ratingError}</Text>
      ) : (
        <Text style={styles.caption}>별점을 선택해주세요</Text>
      )}

      <Text style={styles.reviewLabel}>
        리뷰 작성 <Text style={styles.required}>*</Text>
      </Text>
      <View
        style={[
          styles.reviewInputContainer,
          reviewError && {borderColor: '#FF5252'},
        ]}>
        <TextInput
          style={styles.reviewInput}
          value={reviewText}
          placeholder="장소에 대한 후기를 작성해 주세요."
          placeholderTextColor="#8E9398"
          multiline
          onChangeText={setReviewText}
        />
      </View>

      {reviewError ? (
        <Text style={styles.errorText}>{reviewError}</Text>
      ) : (
        <Text style={styles.charLimit}>
          {reviewText.length > 0
            ? `${reviewText.length} / 500`
            : '500자 이내 입력 가능합니다.'}
        </Text>
      )}

      <Text style={styles.photoUploadLabel}>사진 업로드</Text>
      <Text style={styles.photoUploadDescription}>
        사진 업로드는 한 장만 가능합니다.
      </Text>
      <TouchableOpacity style={styles.photoUploadBox} onPress={handleImagePick}>
        {selectedImage ? (
          <Image
            source={{uri: selectedImage.uri}}
            style={styles.selectedImage}
          />
        ) : (
          <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <Path
              d="M14.5833 3.49992H9.1C7.13982 3.49992 6.15972 3.49992 5.41103 3.8814C4.75247 4.21695 4.21703 4.75238 3.88148 5.41095C3.5 6.15964 3.5 7.13973 3.5 9.09992V18.8999C3.5 20.8601 3.5 21.8402 3.88148 22.5889C4.21703 23.2475 4.75247 23.7829 5.41103 24.1184C6.15972 24.4999 7.13982 24.4999 9.1 24.4999H19.8333C20.9183 24.4999 21.4608 24.4999 21.9059 24.3807C23.1137 24.057 24.0571 23.1136 24.3807 21.9058C24.5 21.4607 24.5 20.9182 24.5 19.8333M22.1667 9.33325V2.33325M18.6667 5.83325H25.6667M12.25 9.91659C12.25 11.2052 11.2053 12.2499 9.91667 12.2499C8.628 12.2499 7.58333 11.2052 7.58333 9.91659C7.58333 8.62792 8.628 7.58325 9.91667 7.58325C11.2053 7.58325 12.25 8.62792 12.25 9.91659ZM17.4884 13.9044L7.61967 22.876C7.06459 23.3806 6.78705 23.6329 6.7625 23.8515C6.74122 24.0409 6.81386 24.2288 6.95705 24.3547C7.12224 24.4999 7.49733 24.4999 8.2475 24.4999H19.1986C20.8777 24.4999 21.7172 24.4999 22.3766 24.2178C23.2043 23.8637 23.8638 23.2043 24.2179 22.3765C24.5 21.7171 24.5 20.8776 24.5 19.1986C24.5 18.6336 24.5 18.3512 24.4382 18.0881C24.3606 17.7575 24.2118 17.4478 24.0021 17.1807C23.8353 16.9682 23.6147 16.7917 23.1736 16.4388L19.9101 13.828C19.4686 13.4748 19.2479 13.2982 19.0048 13.2359C18.7905 13.1809 18.565 13.1881 18.3546 13.2564C18.1159 13.3339 17.9067 13.5241 17.4884 13.9044Z"
              stroke="#8E9398"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
      </TouchableOpacity>

      {selectedImage && (
        <TouchableOpacity onPress={() => setSelectedImage(null)}>
          <Text style={styles.removeImageText}>사진 삭제</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[
          styles.submitButton,
          rating && reviewText.length > 0 && reviewText.length <= 500
            ? styles.submitButtonActive
            : styles.submitButtonInactive,
        ]}
        onPress={handleSubmit}
        disabled={!rating || reviewText.length === 0 || reviewText.length > 500}>
        <Text
          style={[
            styles.submitButtonText,
            rating && reviewText.length > 0 && reviewText.length <= 500
              ? styles.submitButtonTextActive
              : styles.submitButtonTextInactive,
          ]}>
          등록하기
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    lineHeight: 27,
    marginBottom: 12,
  },
  starRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  caption: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '400',
    color: '#8E9398',
    lineHeight: 18,
    marginBottom: 24,
  },
  reviewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1B',
    lineHeight: 24,
  },
  required: {
    color: '#FF5252',
  },
  reviewInputContainer: {
    height: 232,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    marginTop: 8,
  },
  reviewInput: {
    fontSize: 14,
    lineHeight: 21,
    color: '#1A1A1B',
  },
  charLimit: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8E9398',
    lineHeight: 18,
    marginTop: 8,
  },
  photoUploadLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1B',
    lineHeight: 24,
    marginTop: 24,
    marginBottom: 8,
  },
  photoUploadDescription: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8E9398',
    lineHeight: 18,
    marginBottom: 8,
  },
  photoUploadBox: {
    width: 80,
    height: 80,
    padding: 26,
    alignItems: 'center',
    borderRadius: 5,
    borderColor: '#D2D3D3',
    borderWidth: 1,
    backgroundColor: '#F8F9FA',
  },
  selectedImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  removeImageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF5252',
    textAlign: 'center',
    marginTop: 8,
  },
  submitButton: {
    marginTop: 35,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonInactive: {
    backgroundColor: '#F8F9FA',
  },
  submitButtonActive: {
    backgroundColor: '#222',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
  },
  submitButtonTextInactive: {
    color: '#8E9398',
  },
  submitButtonTextActive: {
    color: '#FFF',
  },
  errorText: {
    fontSize: 12,
    color: '#FF5252',
    marginTop: 4,
  },
});

export default ReviewForm;


/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-trailing-spaces */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Keyboard,
  ScrollView,
} from 'react-native';
import {NativeStackScreenProps, NativeStackNavigationProp} from '@react-navigation/native-stack';
import Svg, {Path, G, ClipPath, Rect, Defs} from 'react-native-svg';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileEdit'>;

const ProfileEdit: React.FC<Props> = () => {
  const [nickname, setNickname] = useState('');
  const [isNicknameValid, setIsNicknameValid] = useState(true);
  const [nicknameMessage, setNicknameMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleNicknameChange = async () => {
    try {
      setIsSubmitting(true);
      const authToken = await AsyncStorage.getItem('authToken');
  
      if (!authToken) {
        Alert.alert('인증 오류', '로그인이 필요합니다.');
        return;
      }

  
      const formData = new FormData();
      formData.append('request', JSON.stringify({ nickname }));
  
      console.log('전송할 FormData:', formData);
  
      const response = await axios.put(
        'http://211.188.51.4/mypage/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
  
      console.log('서버 응답:', response.data);
  
      if (response.data.isSuccess) {
        setIsNicknameValid(true);
        setNicknameMessage('닉네임 변경 성공');
        await AsyncStorage.setItem('userNickname', nickname);
        navigation.navigate('MyPage');
      } else {
        setIsNicknameValid(false);
        setNicknameMessage('닉네임 변경 실패');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log('서버 응답 상태 코드:', error.response?.status);
        console.log('서버 응답 데이터:', error.response?.data);
      } else {
        console.error('요청 실패:', (error as Error).message);
      }
  
      setIsNicknameValid(false);
      setNicknameMessage('닉네임 수정 중 문제 발생');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require('../../../assets/images/profile.png')}
              style={styles.profileImage}
            />
            <View style={styles.addIconContainer}>
              <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
                <G clipPath="url(#clip0_263_4834)">
                  <Path
                    d="M24.5 12C24.5 5.37258 19.1274 0 12.5 0C5.87258 0 0.5 5.37258 0.5 12C0.5 18.6274 5.87258 24 12.5 24C19.1274 24 24.5 18.6274 24.5 12Z"
                    fill="#222222"
                  />
                  <Path
                    d="M16.5 10.6667H13.8334V8.00002C13.8334 7.64642 13.6929 7.30727 13.4428 7.05719C13.1928 6.80717 12.8536 6.66669 12.5 6.66669C12.1464 6.66669 11.8073 6.80717 11.5572 7.05719C11.3072 7.30727 11.1667 7.64642 11.1667 8.00002L11.214 10.6667H8.50002C8.14642 10.6667 7.80727 10.8072 7.55719 11.0572C7.30717 11.3073 7.16669 11.6464 7.16669 12C7.16669 12.3536 7.30717 12.6928 7.55719 12.9428C7.80727 13.1929 8.14642 13.3334 8.50002 13.3334L11.214 13.286L11.1667 16C11.1667 16.3536 11.3072 16.6928 11.5572 16.9428C11.8073 17.1929 12.1464 17.3334 12.5 17.3334C12.8536 17.3334 13.1928 17.1929 13.4428 16.9428C13.6929 16.6928 13.8334 16.3536 13.8334 16V13.286L16.5 13.3334C16.8536 13.3334 17.1929 13.1929 17.4428 12.9428C17.6929 12.6928 17.8334 12.3536 17.8334 12C17.8334 11.6464 17.6929 11.3073 17.4428 11.0572C17.1929 10.8072 16.8536 10.6667 16.5 10.6667Z"
                    fill="white"
                  />
                </G>
                <Defs>
                  <ClipPath id="clip0_263_4834">
                    <Rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </ClipPath>
                </Defs>
              </Svg>
            </View>
          </View>

          <View style={styles.nicknameContainer}>
            <Text style={styles.label}>닉네임</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.nicknameInput,
                  {
                    borderColor: isNicknameValid ? '#F8F9FA' : '#FF5252',
                    borderWidth: isNicknameValid ? 0 : 1,
                  },
                ]}
                value={nickname}
                onChangeText={text => setNickname(text)}
                placeholder="닉네임을 입력하세요"
              />
            </View>
            {nicknameMessage ? (
              <Text
                style={[
                  styles.nicknameMessage,
                  {color: isNicknameValid ? '#8E9398' : '#FF5252'},
                ]}>
                {nicknameMessage}
              </Text>
            ) : null}
          </View>
        </View>
      </ScrollView>

      {!keyboardVisible && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              {backgroundColor: nickname ? '#222' : '#F8F9FA'},
            ]}
            onPress={handleNicknameChange}
            disabled={!nickname || isSubmitting}>
            <Text
              style={[
                styles.nextButtonText,
                {color: nickname ? '#FFF' : '#D2D3D3'},
              ]}>
              수정하기
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingTop: 62,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 36,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  addIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  nicknameContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  label: {
    color: '#1A1A1B',
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nicknameInput: {
    height: 52,
    flex: 1,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
  },
  nicknameMessage: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: 'Pretendard',
    lineHeight: 18,
  },
  footer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: '#FFF',
  },
  nextButton: {
    width: '100%',
    maxWidth: 343,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
  },
  nextButtonText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Bold',
  },
});

export default ProfileEdit;

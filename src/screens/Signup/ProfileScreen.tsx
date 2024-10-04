/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Path, G, ClipPath, Rect, Defs } from 'react-native-svg';
import { RootStackParamList } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [nickname, setNickname] = useState('');
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState('');

  const handleCheckNickname = async () => {
    if (nickname.trim() === '') {
      Alert.alert('닉네임을 입력해 주세요.');
      return;
    }

    try {
      const response = await fetch(
        `http://211.188.51.4/auth/nickname/validation?nickname=${encodeURIComponent(
          nickname,
        )}`,
        {
          method: 'GET',
        },
      );
      const data = await response.json();

      if (data.isSuccess) {
        setIsNicknameValid(true);
        setNicknameMessage('사용 가능한 닉네임입니다!');
      } else {
        setIsNicknameValid(false);
        setNicknameMessage('이미 사용 중인 닉네임입니다.');
      }
    } catch (error) {
      console.error('Error checking nickname:', error);
      Alert.alert('닉네임 확인 중 오류가 발생했습니다.');
    }
  };

  const handleNicknameChange = (text: string) => {
    setNickname(text);
    if (text === '') {
      setNicknameMessage('');
      setIsNicknameValid(false);
    }
  };

  const handleSignUp = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      const password = await AsyncStorage.getItem('userPassword');

      if (!email || !password) {
        Alert.alert('이메일 또는 비밀번호를 찾을 수 없습니다.');
        return;
      }

      await AsyncStorage.setItem('userNickname', nickname);


      const response = await fetch('http://211.188.51.4/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          nickname,
        }),
      });

      const data = await response.json();

      if (data.isSuccess) {
        // Alert.alert('회원가입이 완료되었습니다.');
        navigation.navigate('SignUpComplete');
      } else {
        Alert.alert(`회원가입 실패: ${data.message}`);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      // Alert.alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.greeting}>반가워요!</Text>
        <Text style={styles.subtitle}>
          쉼핑에서 사용할 프로필을 등록해주세요
        </Text>
      </View>

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
                d="M16.5 10.6667H13.8334V8.00002C13.8334 7.64642 13.6929 7.30727 13.4428 7.05719C13.1928 6.80717 12.8536 6.66669 12.5 6.66669C12.1464 6.66669 11.8073 6.80717 11.5572 7.05719C11.3072 7.30727 11.1667 7.64642 11.1667 8.00002L11.214 10.6667H8.50002C8.14642 10.6667 7.80727 10.8072 7.55719 11.0572C7.30717 11.3073 7.16669 11.6464 7.16669 12C7.16669 12.3536 7.30717 12.6928 7.55719 12.9428C7.80727 13.1929 8.14642 13.3334 8.50002 13.3334L11.214 13.286L11.1667 16C11.1667 16.3536 11.3072 16.6928 11.5572 16.9428C11.8073 17.1929 12.1464 17.3334 12.5 17.3334C12.8536 17.3334 13.1928 17.1929 13.4428 16.9428C13.6929 16.6928 13.8334 16.3536 13.8334 16V13.286L16.5 13.3334C16.8536 13.3334 17.1928 13.1929 17.4428 12.9428C17.6929 12.6928 17.8334 12.3536 17.8334 12C17.8334 11.6464 17.6929 11.3073 17.4428 11.0572C17.1928 10.8072 16.8536 10.6667 16.5 10.6667Z"
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
            onChangeText={handleNicknameChange}
            placeholder="닉네임을 입력하세요"
          />
          <TouchableOpacity
            style={[
              styles.checkButton,
              {
                backgroundColor: nickname ? '#222' : '#F8F9FA',
              },
            ]}
            onPress={handleCheckNickname}
            disabled={!nickname}>
            <Text
              style={[
                styles.checkButtonText,
                {
                  color: nickname ? '#FFF' : '#D2D3D3',
                },
              ]}>
              중복 확인
            </Text>
          </TouchableOpacity>
        </View>
        {nicknameMessage ? (
          <Text
            style={[
              styles.nicknameMessage,
              { color: isNicknameValid ? '#8E9398' : '#FF5252' },
            ]}>
            {nicknameMessage}
          </Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={[styles.nextButton, isNicknameValid && styles.nextButtonActive]}
        onPress={handleSignUp}
        disabled={!isNicknameValid}>
        <Text
          style={[
            styles.nextButtonText,
            isNicknameValid && styles.nextButtonTextActive,
          ]}>
          다음
        </Text>
      </TouchableOpacity>
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
  headerContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  greeting: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    color: '#1A1A1B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    color: '#1A1A1B',
    marginBottom: 16,
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
  checkButton: {
    width: 68,
    height: 52,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  checkButtonText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Bold',
  },
  nicknameMessage: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: 'Pretendard',
    lineHeight: 18,
  },
  nextButton: {
    width: '100%',
    maxWidth: 343,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    position: 'absolute',
    bottom: 57,
  },
  nextButtonActive: {
    backgroundColor: '#222',
  },
  nextButtonText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Bold',
    color: '#D2D3D3',
  },
  nextButtonTextActive: {
    color: '#FFF',
  },
});

export default ProfileScreen;

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import Svg, {Path, G, ClipPath, Defs, Rect} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import NaverLogin, {NaverLoginResponse} from '@react-native-seoul/naver-login';
import axios from 'axios';

type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Splash'
>;

const consumerKey = 'XQ774qjn0QvrLziS0efY';
const consumerSecret = '6OIm7uvnU6';
const appName = 'ShwimPing';

const Splash = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    NaverLogin.initialize({
      appName,
      consumerKey,
      consumerSecret,
      disableNaverAppAuthIOS: true,
    });
  }, []);

  const loginWithNaver = async () => {
    try {
      const {successResponse, failureResponse} = await NaverLogin.login();

      if (successResponse) {
        const authCode = successResponse.accessToken;
        Alert.alert('로그인 성공', `액세스 토큰: ${authCode}`);
        await postToBackend(authCode);
        navigation.navigate('Home');
      } else if (failureResponse) {
        Alert.alert('로그인 실패', failureResponse.message);
      }
    } catch (error) {
      console.error('네이버 로그인 에러:', error);
    }
  };

  const postToBackend = async (authCode: string) => {
    try {
      const response = await axios.post(
        'http://211.188.51.4/auth/login/naver',
        {
          authCode,
        },
      );
      console.log('서버 응답:', response.data);
    } catch (error) {
      console.error('백엔드 전송 에러:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>LOGO</Text>
      </View>

      <TouchableOpacity style={styles.naverButton} onPress={loginWithNaver}>
        <Svg width="17" height="16" viewBox="0 0 17 16" fill="none">
          <G clipPath="url(#clip0_241_1067)">
            <Path
              d="M11.3491 8.56267L5.41687 0H0.5V16H5.65088V7.436L11.5831 16H16.5V0H11.3491V8.56267Z"
              fill="white"
            />
          </G>
          <Defs>
            <ClipPath id="clip0_241_1067">
              <Rect
                width="16"
                height="16"
                fill="white"
                transform="translate(0.5)"
              />
            </ClipPath>
          </Defs>
        </Svg>
        <Text style={styles.naverButtonText}>네이버로 시작하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.kakaoButton}>
        <Svg width="19" height="18" viewBox="0 0 19 18" fill="none">
          <G clipPath="url(#clip0_241_496)">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.50002 0.599976C4.52917 0.599976 0.5 3.71293 0.5 7.55226C0.5 9.94 2.0584 12.0449 4.43152 13.2969L3.43303 16.9445C3.34481 17.2668 3.71341 17.5237 3.99646 17.3369L8.37334 14.4482C8.7427 14.4838 9.11808 14.5046 9.50002 14.5046C14.4705 14.5046 18.4999 11.3918 18.4999 7.55226C18.4999 3.71293 14.4705 0.599976 9.50002 0.599976Z"
              fill="black"
            />
          </G>
          <Defs>
            <ClipPath id="clip0_241_496">
              <Rect
                width="17.9999"
                height="18"
                fill="white"
                transform="translate(0.5)"
              />
            </ClipPath>
          </Defs>
        </Svg>
        <Text style={styles.kakaoButtonText}>카카오로 시작하기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.emailButton}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.emailButtonText}>이메일로 시작하기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tourButton}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.tourButtonText}>둘러보기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    width: 238,
    height: 238,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 82,
  },
  logoText: {
    fontSize: 20,
    color: '#000',
  },
  naverButton: {
    display: 'flex',
    flexDirection: 'row',
    width: 303,
    height: 54,
    padding: 0,
    paddingHorizontal: 35,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    borderRadius: 5,
    backgroundColor: '#03C75A',
    marginBottom: 12,
  },
  naverButtonText: {
    color: '#FFF',
    fontFamily: 'Pretendard-Semibold',
    fontSize: 16,
    fontStyle: 'normal',
    lineHeight: 24,
  },
  kakaoButton: {
    display: 'flex',
    flexDirection: 'row',
    width: 303,
    height: 54,
    padding: 0,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    borderRadius: 6,
    backgroundColor: '#FEE500',
    marginBottom: 12,
  },
  kakaoButtonText: {
    color: 'rgba(0, 0, 0, 0.85)',
    fontFamily: 'Pretendard-Semibold',
    fontSize: 15,
    fontStyle: 'normal',
    lineHeight: 24,
  },
  emailButton: {
    display: 'flex',
    width: 303,
    height: 54,
    padding: 0,
    paddingHorizontal: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E6E6EA',
    backgroundColor: '#FFF',
    marginBottom: 34,
  },
  emailButtonText: {
    color: '#8E9398',
    fontFamily: 'Pretendard-Semibold',
    fontSize: 16,
    fontStyle: 'normal',
    lineHeight: 24,
  },
  tourButton: {
    marginTop: 10,
  },
  tourButtonText: {
    color: '#8E9398',
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    fontStyle: 'normal',
    lineHeight: 21,
    textDecorationLine: 'underline',
  },
});

export default Splash;

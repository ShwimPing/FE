import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import Svg, {Path, G, Defs, Rect, ClipPath} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStackParamList} from '../App';
import NaverLogin from '@react-native-seoul/naver-login';
import axios from 'axios';
import {KakaoOAuthToken, login as kakaoLogin} from '@react-native-seoul/kakao-login';

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
        const accessToken = successResponse.accessToken;
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('loginProvider', 'NAVER');
        await postToBackend(accessToken, 'NAVER');
        navigation.navigate('Home');
      } else if (failureResponse) {
        Alert.alert('로그인 실패', failureResponse.message);
      }
    } catch (error) {
      console.error('네이버 로그인 에러:', error);
    }
  };

  const loginWithKakao = async () => {
    try {
      const token: KakaoOAuthToken = await kakaoLogin();
      const accessToken = token.accessToken;

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('loginProvider', 'KAKAO');

      await postToBackend(accessToken, 'KAKAO');
      navigation.navigate('Home');
    } catch (error) {
      console.error('카카오 로그인 에러:', error);
      Alert.alert('카카오 로그인 실패', '카카오 로그인을 처리하는 중 문제가 발생했습니다.');
    }
  };

  const postToBackend = async (accessToken: string, provider: string) => {
    try {
      console.log(`${provider} 로그인으로 전송할 데이터:`, {accessToken});

      const response = await axios.post(
        `http://211.188.51.4/auth/login/${provider}`,
        {accessToken},
        {headers: {'Content-Type': 'application/json'}},
      );

      console.log('서버 응답:', response.data);
    if (response.data.isSuccess && response.data.results) {
      const serverAccessToken = response.data.results.accessToken;
      console.log('서버에서 받은 액세스 토큰:', serverAccessToken);

      await AsyncStorage.setItem('accessToken', serverAccessToken);
      console.log('새로운 토큰 저장 완료');
    }
    } catch (error) {
      console.error(`${provider} 로그인 백엔드 전송 에러:`, error);
      Alert.alert(
        `${provider} 로그인 실패`,
        '서버와 통신 중 문제가 발생했습니다. 다시 시도해 주세요.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
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
            <ClipPath id="clip0_241_1067)">
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

      <TouchableOpacity style={styles.kakaoButton} onPress={loginWithKakao}>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 82,
  },
  logoImage: {
    width: 150,
    height: 150,
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

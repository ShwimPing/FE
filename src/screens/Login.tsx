import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {useAuth} from '../services/AuthContext';
import NaverLogin from '@react-native-seoul/naver-login';
import {
  KakaoOAuthToken,
  login as kakaoLogin,
} from '@react-native-seoul/kakao-login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login: React.FC<Props> = ({navigation}) => {
  const {login} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('이메일과 비밀번호를 입력해 주세요.');
      return;
    }

    try {
      await login(email, password);
      await AsyncStorage.setItem('loginProvider', 'SELF');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('로그인 실패', '이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const loginWithNaver = async () => {
    try {
      const {successResponse, failureResponse} = await NaverLogin.login();

      if (successResponse) {
        const accessToken = successResponse.accessToken;

        await AsyncStorage.setItem('accessToken', accessToken);
        const storedToken = await AsyncStorage.getItem('accessToken');
        await AsyncStorage.setItem('loginProvider', 'NAVER');
        console.log('저장된 네이버 토큰: ', storedToken);

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
      Alert.alert(
        '카카오 로그인 실패',
        '카카오 로그인을 처리하는 중 문제가 발생했습니다.',
      );
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

      <TextInput
        style={styles.input}
        placeholder="이메일을 입력해 주세요."
        placeholderTextColor="#8E9398"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호를 입력해 주세요."
        placeholderTextColor="#8E9398"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      <Text style={styles.snsLoginText}>SNS 계정으로 로그인하기</Text>

      <View style={styles.snsButtonsContainer}>
        <TouchableOpacity style={styles.snsButton} onPress={loginWithKakao}>
          <Image
            source={require('../../assets/images/kakaoicon.png')}
            style={styles.snsIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.snsButton} onPress={loginWithNaver}>
          <Image
            source={require('../../assets/images/navericon.png')}
            style={styles.snsIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => navigation.navigate('Terms')}>
        <Text style={styles.signupText}>회원가입</Text>
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
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 52,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  input: {
    display: 'flex',
    height: 52,
    width: 343,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 4,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    marginBottom: 28,
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    color: '#000',
  },
  loginButton: {
    display: 'flex',
    width: 343,
    height: 50,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#222',
    marginBottom: 120,
    marginTop: 10,
  },
  loginButtonText: {
    color: '#FFF',
    fontFamily: 'Pretendard-Bold',
    fontSize: 14,
    lineHeight: 21,
  },
  snsLoginText: {
    color: '#8E9398',
    textAlign: 'center',
    fontFamily: 'Pretendard-Bold',
    fontSize: 12,
    fontStyle: 'normal',
    lineHeight: 18,
    marginBottom: 16,
  },
  snsButtonsContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  snsButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  snsIcon: {
    width: 54,
    height: 54,
  },
  signupButton: {
    marginTop: 16,
  },
  signupText: {
    color: '#1A1A1B',
    fontFamily: 'Pretendard-Bold',
    fontSize: 12,
    fontStyle: 'normal',
    lineHeight: 18,
  },
});

export default Login;

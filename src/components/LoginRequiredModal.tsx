import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import Svg, {Path, G} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import axios from 'axios';
import {KakaoOAuthToken, login as kakaoLogin} from '@react-native-seoul/kakao-login';
import NaverLogin from '@react-native-seoul/naver-login';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginRequiredModalProps = {
  visible: boolean;
  onClose: () => void;
  onLogin?: () => void;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({visible, onClose}) => {
  const navigation = useNavigation<NavigationProp>();

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

  const loginWithNaver = async () => {
    try {
      const {successResponse} = await NaverLogin.login();

      if (successResponse) {
        const accessToken = successResponse.accessToken;
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('loginProvider', 'NAVER');
        await postToBackend(accessToken, 'NAVER');

        onClose();
        navigation.navigate('Home');
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

      onClose();
      navigation.navigate('Home');
    } catch (error) {
      console.error('카카오 로그인 에러:', error);
    }
  };

  const handleEmailLogin = () => {
    onClose();
    navigation.navigate('Login');
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>쉼핑에 로그인하고{'\n'}쉼터 리뷰를 확인해 보세요!</Text>

            <TouchableOpacity style={styles.naverButton} onPress={loginWithNaver}>
              <Svg width="17" height="16" viewBox="0 0 17 16" fill="none">
                <G clipPath="url(#clip0_241_1067)">
                  <Path
                    d="M11.3491 8.56267L5.41687 0H0.5V16H5.65088V7.436L11.5831 16H16.5V0H11.3491V8.56267Z"
                    fill="white"
                  />
                </G>
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
              </Svg>
              <Text style={styles.kakaoButtonText}>카카오로 시작하기</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.emailButton} onPress={handleEmailLogin}>
              <Text style={styles.emailButtonText}>이메일로 시작하기</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    display: 'flex',
    height: 350,
    paddingVertical: 42,
    paddingHorizontal: 36,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
    flexShrink: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#FFF',
    borderColor: '#F0F0F0',
    borderWidth: 1,
  },
  modalTitle: {
    color: '#000',
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    lineHeight: 27,
    marginBottom: 16,
  },
  naverButton: {
    flexDirection: 'row',
    width: '100%',
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    backgroundColor: '#03C75A',
    borderRadius: 6,
    marginBottom: 8,
  },
  naverButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
  },
  kakaoButton: {
    flexDirection: 'row',
    width: '100%',
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    backgroundColor: '#FEE500',
    borderRadius: 6,
    marginBottom: 8,
  },
  kakaoButtonText: {
    color: 'rgba(0, 0, 0, 0.85)',
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
  },
  emailButton: {
    width: '100%',
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6E6EA',
    backgroundColor: '#FFF',
    borderRadius: 6,
  },
  emailButtonText: {
    color: '#8E9398',
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
  },
});

export default LoginRequiredModal;

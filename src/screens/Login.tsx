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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login: React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('이메일과 비밀번호를 입력해 주세요.');
      return;
    }

    try {
      const response = await fetch('http://211.188.51.4/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      console.log('Response Data:', data);

      if (data.isSuccess && data.results && data.results.accessToken) {
        await AsyncStorage.setItem('authToken', data.results.accessToken);

        navigation.navigate('Home');
      } else {
        Alert.alert('로그인 실패', data.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('로그인 오류', '로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
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
        <TouchableOpacity style={styles.snsButton}>
          <Image
            source={require('../../assets/images/kakaoicon.png')}
            style={styles.snsIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.snsButton}>
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

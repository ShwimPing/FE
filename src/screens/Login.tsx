import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

const Login = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>LOGO</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="이메일을 입력해 주세요."
        placeholderTextColor="#8E9398"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호를 입력해 주세요."
        placeholderTextColor="#8E9398"
        secureTextEntry
      />

      <TouchableOpacity style={styles.loginButton}>
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

      <TouchableOpacity style={styles.signupButton}>
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
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 52,
  },
  logoText: {
    fontSize: 20,
    color: '#000',
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

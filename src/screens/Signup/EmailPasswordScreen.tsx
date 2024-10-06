/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'EmailPassword'>;

const EmailPasswordScreen: React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow,
    );
    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const _keyboardDidShow = () => {
    setIsKeyboardVisible(true);
  };

  const _keyboardDidHide = () => {
    setIsKeyboardVisible(false);
  };

  const validateEmail = (email: string) => {
    const isValid = /\S+@\S+\.\S+/.test(email);
    setEmailError(isValid ? '' : '이메일 형식에 맞지 않습니다.');
    return isValid;
  };

  const validatePassword = (password: string) => {
    const isValid = password.length >= 8;
    setPasswordError(isValid ? '' : '비밀번호는 8자 이상이어야 합니다.');
    return isValid;
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    const isValid = confirmPassword === password;
    setConfirmPasswordError(isValid ? '' : '비밀번호가 일치하지 않습니다.');
    return isValid;
  };

  useEffect(() => {
    if (emailTouched) {
      validateEmail(email);
    }
    if (passwordTouched) {
      validatePassword(password);
    }
    if (confirmPasswordTouched) {
      validateConfirmPassword(confirmPassword);
    }
    setIsFormValid(
      validateEmail(email) &&
        validatePassword(password) &&
        validateConfirmPassword(confirmPassword),
    );
  }, [
    email,
    password,
    confirmPassword,
    emailTouched,
    passwordTouched,
    confirmPasswordTouched,
    validateConfirmPassword,
  ]);

  const handleSaveToStorageAndSignUp = async () => {
    if (!isFormValid) {
      Alert.alert('입력한 정보를 다시 확인해 주세요.');
      return;
    }

    try {

      const response = await fetch('http://211.188.51.4/auth/signup', {
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

      if (data.isSuccess) {
        navigation.navigate('SignUpComplete');
      } else {
        Alert.alert(`회원가입 실패: ${data.message}`);
      }
    } catch (error) {
      console.error('회원가입 중 오류:', error);
      Alert.alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            placeholder="이메일을 입력해 주세요."
            placeholderTextColor="#8E9398"
            value={email}
            onChangeText={text => {
              setEmail(text);
              if (!emailTouched) {
                setEmailTouched(true);
              }
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailTouched && emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="영문+숫자 조합 8자 이상"
            placeholderTextColor="#8E9398"
            secureTextEntry
            value={password}
            onChangeText={text => {
              setPassword(text);
              if (!passwordTouched) {
                setPasswordTouched(true);
              }
            }}
          />
          {passwordTouched && passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            placeholder="동일한 비밀번호를 입력해 주세요."
            placeholderTextColor="#8E9398"
            secureTextEntry
            value={confirmPassword}
            onChangeText={text => {
              setConfirmPassword(text);
              if (!confirmPasswordTouched) {
                setConfirmPasswordTouched(true);
              }
            }}
          />
          {confirmPasswordTouched && confirmPasswordError ? (
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          ) : null}
        </View>
      </View>

      {!isKeyboardVisible && (
        <TouchableOpacity
          style={[styles.nextButton, isFormValid && styles.nextButtonActive]}
          onPress={handleSaveToStorageAndSignUp}
          disabled={!isFormValid}>
          <Text
            style={[
              styles.nextButtonText,
              isFormValid && styles.nextButtonTextActive,
            ]}>
            다음
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
  },
  content: {
    marginTop: 32,
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    maxWidth: 343,
    marginBottom: 20,
  },
  label: {
    color: '#000',
    fontFamily: 'Pretendard-Bold',
    fontSize: 14,
    fontStyle: 'normal',
    lineHeight: 21,
    marginBottom: 8,
  },
  input: {
    display: 'flex',
    height: 52,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
    color: '#000',
    marginBottom: 8,
  },
  helperText: {
    color: '#8E9398',
    fontFamily: 'Pretendard',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
  },
  errorText: {
    color: '#D9534F',
    fontFamily: 'Pretendard',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
  },
  nextButton: {
    width: '100%',
    maxWidth: 343,
    height: 50,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    position: 'absolute',
    bottom: 56, // 화면 하단에서 56px 떨어진 위치
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

export default EmailPasswordScreen;

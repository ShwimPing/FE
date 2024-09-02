import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'EmailPassword'>;

const EmailPasswordScreen: React.FC<Props> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            placeholder="이메일을 입력해 주세요."
            placeholderTextColor="#8E9398"
          />
          <Text style={styles.helperText}>도움말 텍스트</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="영문+숫자 조합 8자 이상"
            placeholderTextColor="#8E9398"
            secureTextEntry
          />
          <Text style={styles.helperText}>도움말 텍스트</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            placeholder="동일한 비밀번호를 입력해 주세요."
            placeholderTextColor="#8E9398"
            secureTextEntry
          />
          <Text style={styles.helperText}>도움말 텍스트</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
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
    bottom: 57,
  },
  nextButtonText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Bold',
    color: '#D2D3D3',
  },
  nextButtonActive: {
    backgroundColor: '#222',
  },
});

export default EmailPasswordScreen;

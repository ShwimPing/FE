// EmailPasswordScreen.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App'

type Props = NativeStackScreenProps<RootStackParamList, 'EmailPassword'>;

const EmailPasswordScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>이메일과 비밀번호를 입력해 주세요</Text>
      <TextInput style={styles.input} placeholder="이메일" />
      <TextInput style={styles.input} placeholder="비밀번호" secureTextEntry />
      <TextInput style={styles.input} placeholder="비밀번호 확인" secureTextEntry />
      <TouchableOpacity 
        style={styles.nextButton} 
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontFamily: 'Pretendard-Bold', marginBottom: 20 },
  input: { height: 40, borderColor: '#ddd', borderWidth: 1, width: '80%', marginBottom: 10, padding: 8, borderRadius: 8 },
  nextButton: { padding: 15, backgroundColor: '#ddd', borderRadius: 8 },
  nextButtonText: { color: '#000' },
});

export default EmailPasswordScreen;

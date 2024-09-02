// SignUpCompleteScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUpComplete'>;

const SignUpCompleteScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입이 완료되었습니다!</Text>
      <TouchableOpacity 
        style={styles.nextButton} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.nextButtonText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontFamily: 'Pretendard-Bold', marginBottom: 20 },
  nextButton: { padding: 15, backgroundColor: '#000', borderRadius: 8 },
  nextButtonText: { color: '#fff' },
});

export default SignUpCompleteScreen;

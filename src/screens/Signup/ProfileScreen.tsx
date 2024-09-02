// ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>프로필을 등록해주세요</Text>
      {/* 프로필 등록 UI 구현 */}
      <TouchableOpacity 
        style={styles.nextButton} 
        onPress={() => navigation.navigate('SignUpComplete')}
      >
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontFamily: 'Pretendard-Bold', marginBottom: 20 },
  nextButton: { padding: 15, backgroundColor: '#ddd', borderRadius: 8 },
  nextButtonText: { color: '#000' },
});

export default ProfileScreen;

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Path, Circle } from 'react-native-svg';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Terms'>;

const TermsScreen: React.FC<Props> = ({ navigation }) => {
  const [allChecked, setAllChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState({
    privacy: false,
    service: false,
  });

  const handleAllChecked = () => {
    const newValue = !allChecked;
    setAllChecked(newValue);
    setTermsChecked({
      privacy: newValue,
      service: newValue,
    });
  };

  const handleTermChecked = (key: keyof typeof termsChecked) => {
    const newTermsChecked = { ...termsChecked, [key]: !termsChecked[key] };
    setTermsChecked(newTermsChecked);
    setAllChecked(Object.values(newTermsChecked).every(Boolean));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>
          쉼핑 이용을 위해
          {'\n'}
          약관에 동의해주세요
        </Text>

        <TouchableOpacity style={styles.checkBoxContainer} onPress={handleAllChecked}>
          <CheckIcon filled={allChecked} />
          <Text style={styles.checkBoxText}>전체 동의</Text>
        </TouchableOpacity>

        <View style={styles.termItem}>
          <TouchableOpacity onPress={() => handleTermChecked('privacy')}>
            <CheckIcon filled={termsChecked.privacy} />
          </TouchableOpacity>
          <View style={styles.termTextContainer}>
            <Text style={styles.termText}>(필수) 개인정보 처리방침</Text>
            <Text style={styles.detailText}>약관 상세보기</Text>
          </View>
        </View>

        <View style={styles.termItem}>
          <TouchableOpacity onPress={() => handleTermChecked('service')}>
            <CheckIcon filled={termsChecked.service} />
          </TouchableOpacity>
          <View style={styles.termTextContainer}>
            <Text style={styles.termText}>(필수) 서비스 이용약관</Text>
            <Text style={styles.detailText}>약관 상세보기</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, allChecked && styles.nextButtonActive]}
          onPress={() => allChecked && navigation.navigate('EmailPassword')}
          disabled={!allChecked}>
          <Text style={[styles.nextButtonText, allChecked && styles.nextButtonTextActive]}>
            다음
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CheckIcon = ({ filled }: { filled: boolean }) => (
  <Svg width="16" height="17" viewBox="0 0 16 17" fill="none">
    <Circle cx="8" cy="8.5" r="8" fill={filled ? '#222' : '#D2D3D3'} />
    <Path
      d="M4.7998 8.76664L7.46647 10.9L11.1998 6.09998"
      stroke="white"
      strokeLinecap="round"
    />
  </Svg>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 62,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    marginBottom: 28,
    lineHeight: 27,
    color: '#1A1A1B',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: '#FFF',
    width: '100%',
  },
  checkBoxText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Bold',
    lineHeight: 21,
    color: '#1A1A1B',
    marginLeft: 9,
  },
  termItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    marginLeft: 15,
  },
  termTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 9,
  },
  termText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 21,
    color: '#1A1A1B',
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 18,
    color: '#D2D3D3',
    marginLeft: 9,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 57,
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

export default TermsScreen;

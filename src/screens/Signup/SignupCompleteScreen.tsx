import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUpComplete'>;

const SignUpCompleteScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Svg width="101" height="100" viewBox="0 0 101 100" fill="none">
        <Path
          d="M50.5 91.6666C73.5119 91.6666 92.1667 73.0118 92.1667 50C92.1667 26.9881 73.5119 8.33331 50.5 8.33331C27.4882 8.33331 8.83337 26.9881 8.83337 50C8.83337 73.0118 27.4882 91.6666 50.5 91.6666Z"
          fill="url(#paint0_linear_263_4862)"
        />
        <Path
          d="M31.75 50L44.25 62.5L69.25 37.5M92.1667 50C92.1667 73.0118 73.5119 91.6666 50.5 91.6666C27.4882 91.6666 8.83337 73.0118 8.83337 50C8.83337 26.9881 27.4882 8.33331 50.5 8.33331C73.5119 8.33331 92.1667 26.9881 92.1667 50Z"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Defs>
          <LinearGradient
            id="paint0_linear_263_4862"
            x1="8.83337"
            y1="50"
            x2="92.1667"
            y2="50"
            gradientUnits="userSpaceOnUse">
            <Stop stopColor="#222" />
            <Stop offset="1" stopColor="#222" />
          </LinearGradient>
        </Defs>
      </Svg>

      <Text style={styles.message}>
        헴깅이22 님,{'\n'}회원가입이 완료되었습니다!
      </Text>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.startButtonText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop:167,
    backgroundColor: '#FFF',
  },
  message: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    color: '#1A1A1B',
    textAlign: 'center',
    marginVertical: 12,
  },
  startButton: {
    width: '100%',
    maxWidth: 343,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#222',
    position: 'absolute',
    bottom: 57,
  },
  startButtonText: {
    fontSize: 14,
    lineHeight:21,
    fontFamily: 'Pretendard-Bold',
    color: '#FFF',
  },
});

export default SignUpCompleteScreen;

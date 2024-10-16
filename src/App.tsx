/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useRef, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {enableScreens} from 'react-native-screens';
import {SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import Svg, {Path, G, Defs, ClipPath, Rect} from 'react-native-svg';
import Splash from './screens/Splash';
import Login from './screens/Login';
import TermsScreen from './screens/Signup/TermsScreen';
import SignUpCompleteScreen from './screens/Signup/SignupCompleteScreen';
import EmailPasswordScreen from './screens/Signup/EmailPasswordScreen';
import ProfileScreen from './screens/Signup/ProfileScreen';
import Home from './screens/Home';
import ContentsList from './screens/ContentsList';
import ContentDetail from './screens/ContentDetail';
import MyPage from './screens/MyPage/MyPage';
import ProfileEdit from './screens/MyPage/ProfileEdit';
import MyReview from './screens/MyPage/MyReview';
import MyBookmark from './screens/MyPage/MyBookmark';
import NaverLogin from '@react-native-seoul/naver-login';
import SearchScreen from './screens/SearhScreen';
import SearchDetail from './screens/SearchDetail';
import ReviewForm from './screens/ReviewForm';
import {AuthProvider} from './services/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileCompleteScreen from './screens/Signup/ProfileCompleteScreen';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import Onboarding from './screens/MyPage/Onboarding';

const consumerKey = 'XQ774qjn0QvrLziS0efY';
const consumerSecret = '6OIm7uvnU6';
const appName = 'ShwimPing';

enableScreens();

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Terms: undefined;
  EmailPassword: undefined;
  Profile: undefined;
  SignUpComplete: undefined;
  ProfileComplete: undefined;
  Home: undefined;
  SearchScreen: undefined;
  SearchDetail: {placeId: number};
  ContentsList: undefined;
  ContentDetail: {title: string; cardNewsId: string};
  MyPage: undefined;
  ProfileEdit: undefined;
  MyReview: undefined;
  MyBookmark: undefined;
  ReviewForm: {placeId: number};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const BackIcon = () => (
  <Svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <Path
      d="M25.6 29.2L18.4 22L25.6 14.8"
      stroke="#1A1A1B"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CloseIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <G clip-path="url(#clip0_325_1162)">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.34317 6.34323C6.60352 6.08288 7.02563 6.08288 7.28598 6.34323L17.6569 16.7141C17.9172 16.9745 17.9172 17.3966 17.6569 17.6569C17.3965 17.9173 16.9744 17.9173 16.7141 17.6569L6.34317 7.28604C6.08282 7.02569 6.08282 6.60358 6.34317 6.34323Z"
        fill="#505458"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M17.6568 6.34323C17.9172 6.60358 17.9172 7.02569 17.6568 7.28604L7.28593 17.6569C7.02558 17.9173 6.60347 17.9173 6.34312 17.6569C6.08277 17.3966 6.08277 16.9745 6.34312 16.7141L16.714 6.34323C16.9744 6.08288 17.3965 6.08288 17.6568 6.34323Z"
        fill="#505458"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_325_1162">
        <Rect
          width="16"
          height="16"
          fill="white"
          transform="translate(12 0.686279) rotate(45)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);

const App: React.FC = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  const lastMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    const resetOnboarding = async () => {
      try {
        await AsyncStorage.removeItem('isFirstLaunch');
        console.log('Onboarding 상태 초기화');
      } catch (error) {
        console.error('Error resetting onboarding state:', error);
      }
    };

    resetOnboarding();
  }, []);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const firstLaunch = await AsyncStorage.getItem('isFirstLaunch');
        if (firstLaunch === null) {
          setIsFirstLaunch(true);
          await AsyncStorage.setItem('isFirstLaunch', 'false');
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
      }
    };

    checkFirstLaunch();
  }, []);

  useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: 'default-channel-id',
        channelName: 'Default Channel',
        importance: 4,
        vibrate: true,
      },
      created =>
        console.log(`알림 채널 생성: ${created ? '성공' : '이미 존재'}`),
    );
  }, []);

  useEffect(() => {
    const handleIncomingMessage = async (
      remoteMessage: FirebaseMessagingTypes.RemoteMessage,
    ) => {
      const {notification, messageId} = remoteMessage;

      if (!messageId) {
        console.log('메시지 ID 없음, 처리 중단');
        return;
      }

      if (lastMessageIdRef.current === messageId) {
        console.log(`중복 메시지 감지: ${messageId}, 처리 중단`);
        return;
      }

      lastMessageIdRef.current = messageId;
      console.log(`새로운 메시지 처리 중: ${messageId}`);

      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);

      const requestBody = {
        fcmToken: fcmToken,
        title: notification?.title || 'Default Title',
        body: notification?.body || 'Default Body',
      };

      try {
        const response = await fetch('http://211.188.51.4/feign/fcm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          console.error('서버 요청 실패:', response.statusText);
        } else {
          const data = await response.json();
          console.log('서버 응답:', data);
        }
      } catch (error) {
        console.error('서버 요청 중 오류 발생:', error);
      }

      PushNotification.localNotification({
        channelId: 'default-channel-id',
        title: notification?.title || 'New FCM Message',
        message: notification?.body || 'You have received a new notification',
        playSound: true,
        soundName: 'default',
        importance: 'high',
      });
    };

    const unsubscribe = messaging().onMessage(handleIncomingMessage);

    return () => {
      console.log('메시지 수신 핸들러 해제');
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const clearAsyncStorage = async () => {
      try {
        await AsyncStorage.clear();
        // console.log('AsyncStorage cleared on app start');
      } catch (error) {
        console.error('Failed to clear AsyncStorage:', error);
      }
    };

    clearAsyncStorage();
  }, []);

  useEffect(() => {
    try {
      NaverLogin.initialize({
        appName,
        consumerKey,
        consumerSecret,
        disableNaverAppAuthIOS: true,
      });
      // console.log('Naver Login initialized successfully');
    } catch (error) {
      console.error('Naver Login initialization failed:', error);
    }
  }, []);

  return (
    <AuthProvider>
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
        <Stack.Navigator
            initialRouteName={isFirstLaunch ? 'Onboarding' : 'Splash'}
            screenOptions={{
              headerShown: false,
              animation: 'fade',
            }}>
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen
              name="Login"
              component={Login}
              options={({navigation}) => ({
                headerShown: true,
                headerTitle: '로그인',
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: '#1A1A1B',
                  fontFamily: 'Pretendard-Bold',
                  fontSize: 14,
                  fontStyle: 'normal',
                  lineHeight: 21,
                  textAlign: 'center',
                },
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <BackIcon />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="Terms"
              component={TermsScreen}
              options={({navigation}) => ({
                headerShown: true,
                headerTitle: '회원가입',
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: '#1A1A1B',
                  fontFamily: 'Pretendard-Bold',
                  fontSize: 14,
                  fontStyle: 'normal',
                  lineHeight: 21,
                  textAlign: 'center',
                },
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <BackIcon />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="EmailPassword"
              component={EmailPasswordScreen}
              options={({navigation}) => ({
                headerShown: true,
                headerTitle: '회원가입',
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: '#1A1A1B',
                  fontFamily: 'Pretendard-Bold',
                  fontSize: 14,
                  fontStyle: 'normal',
                  lineHeight: 21,
                  textAlign: 'center',
                },
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <BackIcon />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={({navigation}) => ({
                headerShown: true,
                headerTitle: '회원가입',
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: '#1A1A1B',
                  fontFamily: 'Pretendard-Bold',
                  fontSize: 14,
                  fontStyle: 'normal',
                  lineHeight: 21,
                  textAlign: 'center',
                },
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <BackIcon />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="SignUpComplete"
              component={SignUpCompleteScreen}
              options={({navigation}) => ({
                headerShown: true,
                headerTitle: '회원가입',
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: '#1A1A1B',
                  fontFamily: 'Pretendard-Bold',
                  fontSize: 14,
                  fontStyle: 'normal',
                  lineHeight: 21,
                  textAlign: 'center',
                },
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <BackIcon />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="ProfileComplete"
              component={ProfileCompleteScreen}
              options={({navigation}) => ({
                headerShown: true,
                headerTitle: '프로필 등록',
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: '#1A1A1B',
                  fontFamily: 'Pretendard-Bold',
                  fontSize: 14,
                  fontStyle: 'normal',
                  lineHeight: 21,
                  textAlign: 'center',
                },
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <BackIcon />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SearchScreen"
              component={SearchScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ReviewForm"
              component={ReviewForm}
              options={({navigation}) => ({
                headerShown: true,
                headerTitle: '리뷰 작성하기',
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: '#1A1A1B',
                  fontFamily: 'Pretendard-Bold',
                  fontSize: 14,
                  fontStyle: 'normal',
                  lineHeight: 21,
                  textAlign: 'center',
                },
                headerLeft: () => null,
                headerBackVisible: false,
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <CloseIcon />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="SearchDetail"
              component={SearchDetail}
              options={({navigation}) => ({
                headerShown: true,
                headerTitle: '',
                headerShadowVisible: false,
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <BackIcon />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="ContentsList"
              component={ContentsList}
              options={{
                headerShown: true,
                headerTitle: '콘텐츠',
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: '#1A1A1B',
                  fontFamily: 'Pretendard-Bold',
                  fontSize: 14,
                },
                headerLeft: () => null,
                headerBackVisible: false,
              }}
            />
            <Stack.Screen
              name="ContentDetail"
              component={ContentDetail}
              options={{
                headerShown: true,
                headerTitle: '콘텐츠',
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: '#1A1A1B',
                  fontFamily: 'Pretendard-Bold',
                  fontSize: 14,
                },
                headerLeft: () => null,
                headerBackVisible: false,
              }}
            />
            <Stack.Screen
              name="MyPage"
              component={MyPage}
              options={{
                headerShown: true,
                headerTitle: '마이페이지',
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: '#1A1A1B',
                  fontFamily: 'Pretendard-Bold',
                  fontSize: 14,
                },
                headerLeft: () => null,
                headerBackVisible: false,
              }}
            />
            <Stack.Screen
              name="ProfileEdit"
              component={ProfileEdit}
              options={({navigation}) => ({
                headerShown: true,
                headerTitle: '프로필 수정',
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: '#1A1A1B',
                  fontFamily: 'Pretendard-Bold',
                  fontSize: 14,
                  fontStyle: 'normal',
                  lineHeight: 21,
                  textAlign: 'center',
                },
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <BackIcon />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="MyReview"
              component={MyReview}
              options={({navigation}) => ({
                headerShown: true,
                headerTitle: '내 리뷰',
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: '#1A1A1B',
                  fontFamily: 'Pretendard-Bold',
                  fontSize: 14,
                  fontStyle: 'normal',
                  lineHeight: 21,
                  textAlign: 'center',
                },
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <BackIcon />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="MyBookmark"
              component={MyBookmark}
              options={({navigation}) => ({
                headerShown: true,
                headerTitle: '북마크',
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: '#1A1A1B',
                  fontFamily: 'Pretendard-Bold',
                  fontSize: 14,
                  fontStyle: 'normal',
                  lineHeight: 21,
                  textAlign: 'center',
                },
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <BackIcon />
                  </TouchableOpacity>
                ),
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

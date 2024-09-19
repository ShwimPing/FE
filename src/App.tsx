/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {enableScreens} from 'react-native-screens';
import {SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import Svg, {Path} from 'react-native-svg';
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
import NaverLogin from '@react-native-seoul/naver-login';
import SearchScreen from './screens/SearhScreen';
import SearchDetail from './screens/SearchDetail';

const consumerKey = 'XQ774qjn0QvrLziS0efY';
const consumerSecret = '6OIm7uvnU6';
const appName = 'ShwimPing';

enableScreens();

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Terms: undefined;
  EmailPassword: undefined;
  Profile: undefined;
  SignUpComplete: undefined;
  Home: undefined;
  SearchScreen: undefined;
  SearchDetail: { placeId: number };
  ContentsList: undefined;
  ContentDetail: {title: string};
  MyPage: undefined;
  ProfileEdit: undefined;
  MyReview: undefined;
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

const App: React.FC = () => {
  useEffect(() => {
    try {
      NaverLogin.initialize({
        appName,
        consumerKey,
        consumerSecret,
        disableNaverAppAuthIOS: true,
      });
      console.log('Naver Login initialized successfully');
    } catch (error) {
      console.error('Naver Login initialization failed:', error);
    }
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}>
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
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

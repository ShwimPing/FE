import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import Svg, {Path, G, Defs, ClipPath, Rect} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import Footer from '../../components/Footer';

type MyPageNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MyPage'
>;

const MyPage = () => {
  const navigation = useNavigation<MyPageNavigationProp>();
  const [isPushEnabled, setIsPushEnabled] = React.useState(false);

  const toggleSwitch = () => setIsPushEnabled(previousState => !previousState);

  return (
    <View style={styles.pageContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileSection}>
          <Image
            source={require('../../../assets/images/profile.png')}
            style={styles.profileImage}
          />
          <View style={styles.nicknameSection}>
            <Text style={styles.nickname}>햄깅이22</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('ProfileEdit')}>
              <Svg width="24" height="25" viewBox="0 0 24 25" fill="none">
                <Path
                  d="M9 18.5L15 12.5L9 6.5"
                  stroke="#505458"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>
          <View style={styles.accountSection}>
            <Text style={styles.connectedAccount}>연결된 계정</Text>
            <Image
              source={require('../../../assets/images/navericon.png')}
              style={styles.accountIcon}
            />
          </View>
        </View>
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>북마크</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('MyReview')}>
            <Text style={styles.menuText}>내 리뷰</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>개인정보처리방침</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>서비스 이용약관</Text>
          </TouchableOpacity>
          <View style={styles.menuItem}>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>푸시 알림 설정</Text>
              <Text style={styles.pushDescription}>
                한파, 폭염 시 알림을 보내드려요
              </Text>
            </View>
            <Switch
              value={isPushEnabled}
              onValueChange={toggleSwitch}
              thumbColor="#FFFFFF"
              trackColor={{false: '#767577', true: '#FF6C3E'}}
              ios_backgroundColor="#767577"
              style={{transform: [{scaleX: 1.3}, {scaleY: 1.3}]}}
            />
          </View>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>앱 버전</Text>
          <Text style={styles.versionNumber}>1.0.0</Text>
        </View>
        <View style={styles.withdrawalSection}>
          <TouchableOpacity style={styles.withdrawalButton}>
            <Text style={styles.withdrawalText}>회원탈퇴</Text>
            <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <G clipPath="url(#clip0_287_1824)">
                <Path
                  d="M-53.2766 18.4172L-61.7344 9.92664L-53.2711 1.46339L-51.6678 -0.1399V20.0322V25.9247L-48.3345 29.2816V39.1383C-43.1772 50.5521 -34.3486 59.9527 -23.3551 65.8335H-12.04L-7.07525 70.8335H9.99883V65.8335H15.1405V64.1669H41.9473L46.9472 59.1669H64.9988V64.1669H41.9473L33.6139 72.5002H3.33217C0.078186 72.5002 -3.11181 72.2258 -6.21593 71.6989L-7.07525 70.8335H-10.3633C-14.9386 69.6976 -19.2945 68.0057 -23.3551 65.8335H-48.3345V39.1383C-49.7205 36.0708 -50.8414 32.858 -51.6678 29.529V25.9247L-52.5988 24.9871C-52.9483 22.8354 -53.1767 20.643 -53.2766 18.4172Z"
                  fill="#8E9398"
                />
                <Path
                  d="M10.599 5.10102C10.5433 5.04523 10.4528 5.04523 10.3971 5.10102L9.89398 5.60423C9.8383 5.65992 9.83821 5.75017 9.89378 5.80597L10.8403 6.75642C10.93 6.84647 10.8662 7 10.7391 7H6.14203C6.06316 7 5.99922 7.06394 5.99922 7.14281V7.85719C5.99922 7.93606 6.06316 8 6.14203 8H10.7382C10.8654 8 10.9291 8.1538 10.8392 8.24377L9.89382 9.18939C9.8382 9.24502 9.83804 9.33514 9.89346 9.39097L10.3971 9.89827C10.4528 9.95439 10.5435 9.95455 10.5994 9.89862L12.8965 7.60097C12.9522 7.5452 12.9522 7.4548 12.8965 7.39903L10.599 5.10102ZM3.99974 4.14281C3.99974 4.06394 4.06368 4 4.14255 4H7.85589C7.93476 4 7.9987 3.93606 7.9987 3.85719V3.14281C7.9987 3.06394 7.93476 3 7.85589 3H3.99974C3.44988 3 3 3.45 3 4V11C3 11.55 3.44988 12 3.99974 12H7.85589C7.93476 12 7.9987 11.9361 7.9987 11.8572V11.1428C7.9987 11.0639 7.93476 11 7.85589 11H4.14255C4.06368 11 3.99974 10.9361 3.99974 10.8572V4.14281Z"
                  fill="#8E9398"
                />
              </G>
              <Defs>
                <ClipPath id="clip0_287_1824">
                  <Rect width="16" height="16" fill="white" />
                </ClipPath>
              </Defs>
            </Svg>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.footerWrapper}>
        <Footer />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  nicknameSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname: {
    color: '#000',
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    lineHeight: 27,
    marginRight: 8,
  },
  accountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  connectedAccount: {
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Pretendard-Bold',
    fontSize: 14,
    lineHeight: 21,
  },
  accountIcon: {
    width: 20,
    height: 20,
    marginLeft: 8,
  },
  menuSection: {
    marginTop: 45,
  },
  menuItem: {
    display: 'flex',
    height: 48,
    paddingVertical: 0,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuText: {
    color: '#1A1A1B',
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    lineHeight: 21,
    flex: 1,
  },
  menuTextContainer: {
    flex: 1,
  },
  pushDescription: {
    color: '#8E9398',
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    lineHeight: 18,
  },
  versionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  versionText: {
    color: '#8E9398',
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    lineHeight: 18,
  },
  versionNumber: {
    color: '#8E9398',
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    lineHeight: 18,
  },
  withdrawalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  withdrawalButton: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    width: 60,
    height: 20,
    paddingVertical: 1,
    paddingLeft: 2,
    justifyContent: 'center',
    flexShrink: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#8E9398',
    borderRadius: 4,
  },
  withdrawalText: {
    color: '#8E9398',
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    lineHeight: 18,
    marginRight: 2,
    marginTop: -2,
  },
  footerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default MyPage;
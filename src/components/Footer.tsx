import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Footer = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuBox}
        onPress={() => navigation.navigate('Home')}>
        <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
          <Path
            d="M13.8573 2.764C13.506 2.49075 13.3303 2.35412 13.1363 2.3016C12.9652 2.25526 12.7848 2.25526 12.6137 2.3016C12.4197 2.35412 12.244 2.49075 11.8927 2.764L5.11039 8.03912C4.65702 8.39175 4.43034 8.56806 4.26703 8.78886C4.12237 8.98444 4.0146 9.20478 3.94903 9.43905C3.875 9.70352 3.875 9.9907 3.875 10.5651V17.8C3.875 18.9201 3.875 19.4801 4.09299 19.908C4.28473 20.2843 4.59069 20.5903 4.96702 20.782C5.39484 21 5.9549 21 7.075 21H9.075C9.35503 21 9.49504 21 9.602 20.9455C9.69608 20.8976 9.77257 20.8211 9.8205 20.727C9.875 20.62 9.875 20.48 9.875 20.2V13.6C9.875 13.0399 9.875 12.7599 9.98399 12.546C10.0799 12.3578 10.2328 12.2049 10.421 12.109C10.6349 12 10.9149 12 11.475 12H14.275C14.8351 12 15.1151 12 15.329 12.109C15.5172 12.2049 15.6701 12.3578 15.766 12.546C15.875 12.7599 15.875 13.0399 15.875 13.6V20.2C15.875 20.48 15.875 20.62 15.9295 20.727C15.9774 20.8211 16.0539 20.8976 16.148 20.9455C16.255 21 16.395 21 16.675 21H18.675C19.7951 21 20.3552 21 20.783 20.782C21.1593 20.5903 21.4653 20.2843 21.657 19.908C21.875 19.4801 21.875 18.9201 21.875 17.8V10.5651C21.875 9.9907 21.875 9.70352 21.801 9.43905C21.7354 9.20478 21.6276 8.98444 21.483 8.78886C21.3197 8.56806 21.093 8.39175 20.6396 8.03913L13.8573 2.764Z"
            stroke="#1A1A1B"
            stroke-width="1.3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </Svg>
        <Text style={styles.menuText}>홈</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => navigation.navigate('PlaceRecommendation')}> */}
      <TouchableOpacity style={styles.menuBox}>
        <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
          <Path
            d="M5.625 14.2864C3.77364 15.1031 2.625 16.2412 2.625 17.5C2.625 19.9853 7.10215 22 12.625 22C18.1478 22 22.625 19.9853 22.625 17.5C22.625 16.2412 21.4764 15.1031 19.625 14.2864M18.625 8C18.625 12.0637 14.125 14 12.625 17C11.125 14 6.625 12.0637 6.625 8C6.625 4.68629 9.31129 2 12.625 2C15.9387 2 18.625 4.68629 18.625 8ZM13.625 8C13.625 8.55228 13.1773 9 12.625 9C12.0727 9 11.625 8.55228 11.625 8C11.625 7.44772 12.0727 7 12.625 7C13.1773 7 13.625 7.44772 13.625 8Z"
            stroke="#8E9398"
            stroke-width="1.3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </Svg>
        <Text style={styles.menuText}>장소추천</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => navigation.navigate('Contents')}> */}
      <TouchableOpacity style={styles.menuBox}>
        <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
          <Path
            d="M14.375 11H8.375M10.375 15H8.375M16.375 7H8.375M20.375 6.8V17.2C20.375 18.8802 20.375 19.7202 20.048 20.362C19.7604 20.9265 19.3015 21.3854 18.737 21.673C18.0952 22 17.2552 22 15.575 22H9.175C7.49484 22 6.65476 22 6.01303 21.673C5.44854 21.3854 4.9896 20.9265 4.70198 20.362C4.375 19.7202 4.375 18.8802 4.375 17.2V6.8C4.375 5.11984 4.375 4.27976 4.70198 3.63803C4.9896 3.07354 5.44854 2.6146 6.01303 2.32698C6.65476 2 7.49484 2 9.175 2H15.575C17.2552 2 18.0952 2 18.737 2.32698C19.3015 2.6146 19.7604 3.07354 20.048 3.63803C20.375 4.27976 20.375 5.11984 20.375 6.8Z"
            stroke="#8E9398"
            stroke-width="1.3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </Svg>
        <Text style={styles.menuText}>콘텐츠</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => navigation.navigate('MyPage')}> */}
      <TouchableOpacity style={styles.menuBox}>
        <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
          <Path
            d="M20.125 21C20.125 19.6044 20.125 18.9067 19.9528 18.3389C19.565 17.0605 18.5645 16.06 17.2861 15.6722C16.7183 15.5 16.0206 15.5 14.625 15.5H9.625C8.22944 15.5 7.53165 15.5 6.96386 15.6722C5.68545 16.06 4.68504 17.0605 4.29724 18.3389C4.125 18.9067 4.125 19.6044 4.125 21M16.625 7.5C16.625 9.98528 14.6103 12 12.125 12C9.63972 12 7.625 9.98528 7.625 7.5C7.625 5.01472 9.63972 3 12.125 3C14.6103 3 16.625 5.01472 16.625 7.5Z"
            stroke="#8E9398"
            stroke-width="1.3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </Svg>
        <Text style={styles.menuText}>마이페이지</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  menuBox: {
    display: 'flex',
    width: 93.75,
    paddingVertical: 8,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    flexShrink: 0,
  },
  menuText: {
    color: '#1A1A1B', // var(--Black) 대체
    fontFamily: 'Pretendard',
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 15,
  },
});

export default Footer;

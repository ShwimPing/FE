import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import Svg, {Path, G, ClipPath, Defs, Rect} from 'react-native-svg';
import Footer from '../components/Footer';
import NaverMapView, {Marker} from 'react-native-nmap';
import Geolocation from 'react-native-geolocation-service';

const Home = () => {
  const [location, setLocation] = useState({
    latitude: 37.5665, // 초기 위치 (서울)
    longitude: 126.978,
    zoom: 10,
  });

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          Alert.alert('위치 권한이 필요합니다.');
        }
      } else {
        getCurrentLocation();
      }
    };

    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 16,
          });
        },
        error => {
          console.log('Error getting location: ', error);
          Alert.alert(
            '위치를 가져올 수 없습니다.',
            '위치 서비스가 활성화되어 있는지 확인해주세요.',
          );
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    };

    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <G clipPath="url(#clip0_283_1462)">
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.56188 1.7499C5.61461 1.7426 4.68649 2.01674 3.89521 2.53756C3.10392 3.05837 2.4851 3.80241 2.11719 4.67536C1.74928 5.5483 1.64885 6.51082 1.82864 7.44091C2.00843 8.371 2.46033 9.22675 3.12706 9.8997C3.79379 10.5726 4.64533 11.0325 5.5737 11.2209C6.50208 11.4093 7.4655 11.3178 8.34181 10.958C9.21813 10.5982 9.96788 9.98628 10.496 9.19985C11.0241 8.41343 11.3069 7.4879 11.3084 6.5406L11.9334 6.54158L11.3084 6.53964C11.3123 5.27577 10.815 4.0619 9.92544 3.16407C9.0359 2.26624 7.82669 1.7577 6.56284 1.7499L6.56188 1.7499ZM12.5584 6.54304C12.5564 7.73773 12.1998 8.90494 11.5337 9.89674C10.8676 10.8887 9.9219 11.6605 8.81658 12.1143C7.71126 12.5681 6.49609 12.6835 5.3251 12.4459C4.15411 12.2083 3.08005 11.6283 2.23909 10.7795C1.39812 9.93067 0.828127 8.85128 0.601357 7.67814C0.374588 6.505 0.50126 5.29095 0.965314 4.18989C1.42937 3.08882 2.20991 2.15035 3.20797 1.49343C4.20604 0.836507 5.37669 0.490731 6.57151 0.499935L6.5667 1.12492L6.57055 0.499928C6.57087 0.49993 6.57119 0.499933 6.57151 0.499935C8.16586 0.510023 9.69123 1.15166 10.8134 2.2843C11.9357 3.41704 12.5632 4.94849 12.5584 6.54304Z"
                fill="#8E9398"
              />
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.2669 10.2576C10.5112 10.0137 10.9069 10.0141 11.1508 10.2585L15.3174 14.4335C15.5613 14.6778 15.5609 15.0735 15.3165 15.3173C15.0722 15.5612 14.6765 15.5608 14.4327 15.3165L10.266 11.1415C10.0222 10.8971 10.0226 10.5014 10.2669 10.2576Z"
                fill="#8E9398"
              />
            </G>
            <Defs>
              <ClipPath id="clip0_283_1462">
                <Rect
                  width="15"
                  height="15"
                  fill="white"
                  transform="translate(0.5 0.5)"
                />
              </ClipPath>
            </Defs>
          </Svg>
          <TextInput
            style={styles.input}
            placeholder="검색어를 입력해주세요."
            placeholderTextColor="#8E9398"
          />
          <Svg width="20" height="21" viewBox="0 0 20 21" fill="none">
            <Path
              d="M15.8333 8.83342V10.5001C15.8333 13.7217 13.2216 16.3334 9.99996 16.3334M4.16663 8.83342V10.5001C4.16663 13.7217 6.7783 16.3334 9.99996 16.3334M9.99996 16.3334V18.8334M6.66663 18.8334H13.3333M9.99996 13.0001C8.61925 13.0001 7.49996 11.8808 7.49996 10.5001V4.66675C7.49996 3.28604 8.61925 2.16675 9.99996 2.16675C11.3807 2.16675 12.5 3.28604 12.5 4.66675V10.5001C12.5 11.8808 11.3807 13.0001 9.99996 13.0001Z"
              stroke="#1A1A1B"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <NaverMapView
          style={styles.map}
          center={{
            latitude: location.latitude,
            longitude: location.longitude,
            zoom: location.zoom,
          }} // 현위치 적용
        />
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }} // 마커 위치
          pinColor="blue"
        />
      </View>

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    display: 'flex',
    height: 60,
    paddingHorizontal: 16,
    paddingVertical: 9.5,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  searchBox: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 4,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#222',
    padding: 0,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default Home;

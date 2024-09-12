import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  TouchableOpacity,
  ScrollView,
  Text,
} from 'react-native';
import Svg, {Path, G, Defs, ClipPath, Rect} from 'react-native-svg';
import Footer from '../components/Footer';
import NaverMapView, {Marker} from 'react-native-nmap';
import Geolocation from 'react-native-geolocation-service';

const categories = [
  '전체',
  '기후동행쉼터',
  '무더위쉼터',
  '도서관쉼터',
  '한파쉼터',
  '지하철역쉼터',
  '스마트쉼터',
];

const Home = () => {
  const mapViewRef = useRef<NaverMapView>(null);
  const [location, setLocation] = useState({
    latitude: 37.5665,
    longitude: 126.978,
    zoom: 10,
  });
  const [selectedCategory, setSelectedCategory] = useState('전체'); // 선택된 카테고리 상태

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
          mapViewRef.current?.animateToCoordinate({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
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

  const moveToCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          zoom: 16,
        });

        mapViewRef.current?.animateToCoordinate({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
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
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.mapContainer}>
        <NaverMapView
          ref={mapViewRef}
          style={styles.map}
          center={{
            latitude: location.latitude,
            longitude: location.longitude,
            zoom: location.zoom,
          }}
        />
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          pinColor="blue"
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <Path
                d="M4.16663 6.5C4.16663 5.09987 4.16663 4.3998 4.43911 3.86502C4.67879 3.39462 5.06124 3.01217 5.53165 2.77248C6.06643 2.5 6.76649 2.5 8.16663 2.5H11.8333C13.2334 2.5 13.9335 2.5 14.4683 2.77248C14.9387 3.01217 15.3211 3.39462 15.5608 3.86502C15.8333 4.3998 15.8333 5.09987 15.8333 6.5V17.5L9.99996 14.1667L4.16663 17.5V6.5Z"
                stroke="#222222"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={moveToCurrentLocation}>
            <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <G clipPath="url(#clip0_297_770)">
                <Path
                  d="M10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17317C0.00433286 8.00043 -0.193701 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8079C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C19.9971 7.34872 18.9426 4.80684 17.0679 2.9321C15.1932 1.05736 12.6513 0.00286757 10 0V0ZM10.8333 18.2908V16.6667C10.8333 16.4457 10.7455 16.2337 10.5893 16.0774C10.433 15.9211 10.221 15.8333 10 15.8333C9.77899 15.8333 9.56703 15.9211 9.41075 16.0774C9.25447 16.2337 9.16667 16.4457 9.16667 16.6667V18.2908C7.25515 18.0962 5.46932 17.248 4.11068 15.8893C2.75204 14.5307 1.9038 12.7449 1.70917 10.8333H3.33334C3.55435 10.8333 3.76631 10.7455 3.92259 10.5893C4.07887 10.433 4.16667 10.221 4.16667 10C4.16667 9.77899 4.07887 9.56703 3.92259 9.41074C3.76631 9.25447 3.55435 9.16667 3.33334 9.16667H1.70917C1.9038 7.25514 2.75204 5.46932 4.11068 4.11068C5.46932 2.75203 7.25515 1.9038 9.16667 1.70917V3.33333C9.16667 3.55435 9.25447 3.76631 9.41075 3.92259C9.56703 4.07887 9.77899 4.16667 10 4.16667C10.221 4.16667 10.433 4.07887 10.5893 3.92259C10.7455 3.76631 10.8333 3.55435 10.8333 3.33333V1.70917C12.7449 1.9038 14.5307 2.75203 15.8893 4.11068C17.248 5.46932 18.0962 7.25514 18.2908 9.16667H16.6667C16.4457 9.16667 16.2337 9.25447 16.0774 9.41074C15.9211 9.56703 15.8333 9.77899 15.8333 10C15.8333 10.221 15.9211 10.433 16.0774 10.5893C16.2337 10.7455 16.4457 10.8333 16.6667 10.8333H18.2908C18.0962 12.7449 17.248 14.5307 15.8893 15.8893C14.5307 17.248 12.7449 18.0962 10.8333 18.2908ZM13.3333 10C13.3333 10.221 13.2455 10.433 13.0893 10.5893C12.933 10.7455 12.721 10.8333 12.5 10.8333H10.8333V12.5C10.8333 12.721 10.7455 12.933 10.5893 13.0893C10.433 13.2455 10.221 13.3333 10 13.3333C9.77899 13.3333 9.56703 13.2455 9.41075 13.0893C9.25447 12.933 9.16667 12.721 9.16667 12.5V10.8333H7.5C7.27899 10.8333 7.06703 10.7455 6.91075 10.5893C6.75447 10.433 6.66667 10.221 6.66667 10C6.66667 9.77899 6.75447 9.56703 6.91075 9.41074C7.06703 9.25447 7.27899 9.16667 7.5 9.16667H9.16667V7.5C9.16667 7.27899 9.25447 7.06703 9.41075 6.91074C9.56703 6.75446 9.77899 6.66667 10 6.66667C10.221 6.66667 10.433 6.75446 10.5893 6.91074C10.7455 7.06703 10.8333 7.27899 10.8333 7.5V9.16667H12.5C12.721 9.16667 12.933 9.25447 13.0893 9.41074C13.2455 9.56703 13.3333 9.77899 13.3333 10Z"
                  fill="#222222"
                />
              </G>
              <Defs>
                <ClipPath id="clip0_297_770">
                  <Rect width="20" height="20" fill="white" />
                </ClipPath>
              </Defs>
            </Svg>
          </TouchableOpacity>
        </View>
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
  categoriesContainer: {
    paddingHorizontal: 16,
    marginTop: 22,
  },
  categoryButton: {
    display: 'flex',
    height: 32,
    paddingVertical: 5,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D2D3D3',
    backgroundColor: '#F8F9FA',
    marginRight: 10,
  },
  selectedCategoryButton: {
    borderColor: '#222',
  },
  selectedCategoryText: {
    color: '#1A1A1B',
  },
  categoryText: {
    color: '#1A1A1B',
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    fontStyle: 'normal',
    lineHeight: 18,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  button: {
    display: 'flex',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#D2D3D3',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
});

export default Home;

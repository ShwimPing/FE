/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Text,
  ScrollView,
  Image,
} from 'react-native';
import NaverMapView, {Marker} from 'react-native-nmap';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import {NAVER_CLIENT_ID, NAVER_API_KEY} from '../../config';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../App';

const SEOUL_COORD = {
  latitude: 37.5665,
  longitude: 126.978,
};

const initialCamera = {
  latitude: 37.5665,
  longitude: 126.978,
  zoom: 16,
  tilt: 0,
  bearing: 0,
};

const categories = [
  {label: '전체', value: 'TOGETHER'},
  {label: '무더위쉼터', value: 'HOT'},
  {label: '한파쉼터', value: 'COLD'},
  {label: '도서관쉼터', value: 'LIBRARY'},
  {label: '스마트쉼터', value: 'SMART'},
];

const MapComponent = () => {
  const mapViewRef = useRef<NaverMapView>(null);
  const [camera, setCamera] = useState(initialCamera);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('TOGETHER');
  const [district, setDistrict] = useState<string>('');
  const [markers, setMarkers] = useState<
    {latitude: number; longitude: number; placeId: number}[]
  >([]);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          Alert.alert('위치 권한이 필요합니다.');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  }, []);

  // 구 정보
  const fetchDistrictName = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        const response = await axios.get(
          'https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc',
          {
            params: {
              coords: `${longitude},${latitude}`,
              orders: 'legalcode,admcode',
              output: 'json',
            },
            headers: {
              'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
              'X-NCP-APIGW-API-KEY': NAVER_API_KEY,
            },
          },
        );

        const region = response.data.results?.[0]?.region;
        const fetchedDistrict = region?.area2?.name || '구 정보 없음';
        setDistrict(fetchedDistrict);

        fetchNearbyPlaces(
          latitude,
          longitude,
          fetchedDistrict,
          selectedCategory,
        );
      } catch (error) {
        console.error('구 정보 가져오기 실패:', error);
      }
    },
    [selectedCategory],
  );

  // 카테고리별 주변 장소
  const fetchNearbyPlaces = async (
    latitude: number,
    longitude: number,
    region: string,
    category: string,
  ) => {
    try {
      const response = await axios.get('http://211.188.51.4/places/nearby', {
        params: {
          longitude,
          latitude,
          radius: 1000,
          category,
          region,
        },
      });

      // console.log('API 응답:', response.data);

      if (response.data.isSuccess) {
        const places = response.data.results.placeList || [];

        if (Array.isArray(places)) {
          setMarkers(
            places.map((place: any) => ({
              latitude: place.latitude,
              longitude: place.longitude,
              placeId: place.placeId,
            })),
          );
        } else {
          console.warn('Unexpected format: results.placeList is not an array.');
          setMarkers([]);
        }
      } else {
        console.warn('데이터 가져오기 실패:', response.data.message);
      }
    } catch (error) {
      console.error('장소 정보 가져오기 실패:', error);
    }
  };

  const moveToCurrentLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;

        const validLatitude =
          Math.abs(latitude - SEOUL_COORD.latitude) > 1
            ? SEOUL_COORD.latitude
            : latitude;
        const validLongitude =
          Math.abs(longitude - SEOUL_COORD.longitude) > 1
            ? SEOUL_COORD.longitude
            : longitude;

        mapViewRef.current?.animateToCoordinate({
          latitude: validLatitude,
          longitude: validLongitude,
        });

        setCamera({
          latitude: validLatitude,
          longitude: validLongitude,
          zoom: 16,
          tilt: 0,
          bearing: 0,
        });

        setCurrentLocation({
          latitude: validLatitude,
          longitude: validLongitude,
        });
        setLocationError(null);

        fetchDistrictName(validLatitude, validLongitude);
      },
      error => {
        console.error('Error getting location:', error);
        setLocationError(
          '위치를 가져올 수 없습니다. 위치 서비스가 활성화되어 있는지 확인해주세요.',
        );
        setCamera(initialCamera);
        mapViewRef.current?.animateToCoordinate({
          latitude: SEOUL_COORD.latitude,
          longitude: SEOUL_COORD.longitude,
        });
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 0},
    );
  }, [fetchDistrictName, mapViewRef]);

  useEffect(() => {
    const initializeLocation = async () => {
      const permissionGranted = await requestLocationPermission();
      if (permissionGranted) {
        moveToCurrentLocation();
      } else {
        setCamera(initialCamera);
        mapViewRef.current?.animateToCoordinate({
          latitude: SEOUL_COORD.latitude,
          longitude: SEOUL_COORD.longitude,
        });
      }
    };

    initializeLocation();
  }, [moveToCurrentLocation, requestLocationPermission]);

  useEffect(() => {
    if (currentLocation && district) {
      fetchNearbyPlaces(
        currentLocation.latitude,
        currentLocation.longitude,
        district,
        selectedCategory,
      );
    }
  }, [currentLocation, selectedCategory, district]);

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  const handleMapClick = (event: {latitude: any; longitude: any}) => {
    const {latitude, longitude} = event;

    console.log(
      `Clicked location: latitude=${latitude}, longitude=${longitude}`,
    );

    fetchDistrictName(latitude, longitude);
  };

  const handleMarkerClick = (placeId: number) => {
    navigation.navigate('SearchDetail', {placeId});
  };

  const handleCameraChange = useCallback(
    async (event: {latitude: number; longitude: number}) => {
      const {latitude, longitude} = event;

      try {
        const response = await axios.get(
          'https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc',
          {
            params: {
              coords: `${longitude},${latitude}`,
              orders: 'legalcode,admcode',
              output: 'json',
            },
            headers: {
              'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
              'X-NCP-APIGW-API-KEY': NAVER_API_KEY,
            },
          },
        );

        const region = response.data.results?.[0]?.region;
        const fetchedDistrict = region?.area2?.name || '';

        if (fetchedDistrict && fetchedDistrict !== district) {
          setDistrict('');
          setMarkers([]);
        }

        fetchNearbyPlaces(
          latitude,
          longitude,
          fetchedDistrict,
          selectedCategory,
        );
        setDistrict(fetchedDistrict);
      } catch (error) {
        console.error('구 정보 가져오기 실패:', error);
      }
    },
    [district, selectedCategory],
  );

  return (
    <View style={styles.container}>
      {/* @ts-ignore: children 속성 오류 무시 */}
      <NaverMapView
        ref={mapViewRef}
        style={styles.map}
        center={{latitude: camera.latitude, longitude: camera.longitude}}
        zoomControl={true}
        showsMyLocationButton={false}
        onMapClick={handleMapClick}
        onCameraChange={handleCameraChange}
        scrollGesturesEnabled={true}>
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            pinColor="blue"
            onClick={() => console.warn('현재 위치 마커 클릭됨')}
          />
        )}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
            pinColor="green"
            onClick={() => handleMarkerClick(marker.placeId)} // placeId 전달
          />
        ))}
      </NaverMapView>

      {locationError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{locationError}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={moveToCurrentLocation}>
          <Image
            source={require('../../assets/images/location.png')}
            style={styles.locationImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.circleContainer}
        style={styles.scrollView}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleCategoryPress(category.value)}>
            <View
              style={[
                styles.circle,
                {
                  marginLeft: index === 0 ? 16 : 6,
                  borderColor:
                    selectedCategory === category.value ? '#222' : '#D2D3D3',
                },
              ]}>
              <Text style={styles.circleText}>{category.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    right: 24,
    bottom: 100,
    zIndex: 1,
  },
  locationImage: {
    width: 48,
    height: 48,
  },
  errorContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'white',
  },
  circleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingRight: 22,
  },
  circle: {
    display: 'flex',
    height: 32,
    paddingVertical: 5,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: '#FFF',
    marginLeft: 6,
  },
  circleText: {
    color: '#1A1A1B',
    fontSize: 12,
    fontWeight: '400',
  },
  scrollView: {
    position: 'absolute',
    top: 22,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
});

export default MapComponent;

/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useEffect, useState } from 'react';
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
import NaverMapView, { Marker } from 'react-native-nmap';
import Geolocation from 'react-native-geolocation-service';

const SEOUL_COORD = {
  latitude: 37.5665,
  longitude: 126.9780,
};

const initialCamera = {
  latitude: 37.5665,
  longitude: 126.9780,
  zoom: 16,
  tilt: 0,
  bearing: 0,
};

const categories = [
  '전체',
  '무더위쉼터',
  '한파쉼터',
  '도서관쉼터',
  '스마트쉼터',
];

const MapComponent = () => {
  const mapViewRef = useRef<NaverMapView>(null);
  const [camera, setCamera] = useState(initialCamera);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('전체');

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
  }, []);

  const requestLocationPermission = async () => {
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
  };

  const moveToCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const validLatitude = Math.abs(latitude - SEOUL_COORD.latitude) > 1 ? SEOUL_COORD.latitude : latitude;
        const validLongitude = Math.abs(longitude - SEOUL_COORD.longitude) > 1 ? SEOUL_COORD.longitude : longitude;

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

        setCurrentLocation({ latitude: validLatitude, longitude: validLongitude });
        setLocationError(null);
      },
      (error) => {
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
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <View style={styles.container}>
      {/* @ts-ignore: children 속성 오류 무시 */}
      <NaverMapView
        ref={mapViewRef}
        style={styles.map}
        center={{ latitude: camera.latitude, longitude: camera.longitude }}
        zoomControl={true}
        showsMyLocationButton={false}
        onMapClick={(e) => console.warn('onMapClick', JSON.stringify(e))}
        scrollGesturesEnabled={true}
      >
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            pinColor="blue"
            onClick={() => console.warn('현재 위치 마커 클릭됨')}
          />
        )}
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
        style={styles.scrollView}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleCategoryPress(category)}
          >
            <View
              style={[
                styles.circle,
                {
                  marginLeft: index === 0 ? 16 : 6,
                  borderColor:
                    selectedCategory === category ? '#222' : '#D2D3D3',
                },
              ]}>
              <Text style={styles.circleText}>{category}</Text>
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

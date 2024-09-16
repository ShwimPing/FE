import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Text,
  ScrollView,
} from 'react-native';
import NaverMapView from 'react-native-nmap';
import Geolocation from 'react-native-geolocation-service';

const initialCamera = {
  latitude: 37.5665,
  longitude: 126.978,
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
  const mapViewRef = useRef<any>(null);
  const [camera, setCamera] = useState(initialCamera);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('전체');

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('위치 권한이 필요합니다.');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const moveToCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;

        console.log('Current position:', {latitude, longitude});

        if (
          latitude < -90 ||
          latitude > 90 ||
          longitude < -180 ||
          longitude > 180
        ) {
          Alert.alert('잘못된 위치 정보가 감지되었습니다. 다시 시도해 주세요.');
          return;
        }

        mapViewRef.current?.animateToCoordinate({
          latitude,
          longitude,
          zoom: 16,
          tilt: 0,
          bearing: 0,
          duration: 1000,
          easing: 'Linear',
        });

        setCamera({
          latitude,
          longitude,
          zoom: 16,
          tilt: 0,
          bearing: 0,
        });
        setLocationError(null);
      },
      error => {
        console.error('Error getting location:', error);
        setLocationError(
          '위치를 가져올 수 없습니다. 위치 서비스가 활성화되어 있는지 확인해주세요.',
        );
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 0},
    );
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <View style={styles.container}>
      <NaverMapView ref={mapViewRef} style={styles.map} center={camera} />
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
                // eslint-disable-next-line react-native/no-inline-styles
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
    elevation: 10,
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
    gap: 10,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: '#FFF',
    marginLeft: 6,
  },
  circleText: {
    color: '#1A1A1B',
    fontFamily: 'Pretendard',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
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

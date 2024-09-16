import React, {useRef} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import NaverMapView from 'react-native-nmap';

const MapComponent = () => {
  const mapViewRef = useRef<NaverMapView>(null);

  return (
    <View style={styles.mapContainer}>
      <NaverMapView
        ref={mapViewRef}
        style={styles.map}
        center={{
          latitude: 37.5665,
          longitude: 126.978,
          zoom: 16,
        }}
      />
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/location.png')}
          style={styles.locationImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
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
});

export default MapComponent;

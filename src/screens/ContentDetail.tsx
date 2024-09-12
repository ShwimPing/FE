import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'ContentDetail'>;

const ContentDetail: React.FC<Props> = ({ route }) => {
  const { title } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.imageContainer}>
          <Image source={require('../../assets/images/heatwave1.png')} style={styles.image} />
          <Image source={require('../../assets/images/heatwave1.png')} style={styles.image} />
          <Image source={require('../../assets/images/heatwave1.png')} style={styles.image} />
          <Image source={require('../../assets/images/heatwave1.png')} style={styles.image} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  scrollView: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    color: '#222',
    fontFamily: 'Pretendard-Bold',
    marginBottom: 20,
  },
  imageContainer: {
    display: 'flex',
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 10,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
  },
});

export default ContentDetail;

import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'ContentDetail'>;

type ImageItem = {
  cardImageUrl: string;
};

const ContentDetail: React.FC<Props> = ({ route }) => {
  const { cardNewsId, title } = route.params;
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchImages = async (id: string) => {
    try {
      const response = await fetch(`http://211.188.51.4/card-news/${id}`);
      const result = await response.json();
      if (result.isSuccess && result.results.cardImageUrlList) {
        setImages(result.results.cardImageUrlList);
      } else {
        console.error('Failed to load data:', result.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(cardNewsId);
  }, [cardNewsId]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>{title}</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.imageContainer}>
            {images.map((item, index) => (
              <Image
                key={index}
                source={{ uri: item.cardImageUrl }}
                style={styles.image}
              />
            ))}
          </View>
        )}
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
    resizeMode: 'contain',
    marginBottom: 10,
  },
});

export default ContentDetail;

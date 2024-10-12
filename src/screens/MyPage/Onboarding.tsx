import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

const {width} = Dimensions.get('window');

type Slide = {
  id: string;
  image: any;
  title: string;
  description: string;
};

const Onboarding: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide> | null>(null);

  const slides: Slide[] = [
    {
      id: '1',
      image: require('../../../assets/images/onboard1.png'),
      title: '쉘터 한 눈에 파악하기',
      description: '홈화면에서 다양한 쉘터를 종류별로 쉽게 확인해요',
    },
    {
      id: '2',
      image: require('../../../assets/images/onboard2.png'),
      title: '쉘터 이야기 남기기',
      description: '쉘터 방문 후기를 작성하고 다른 사용자의 리뷰도 확인해요',
    },
    {
      id: '3',
      image: require('../../../assets/images/onboard3.png'),
      title: '음성 인식으로 쉘터 찾기',
      description: '음성 인식 기능으로 원하는 쉘터를 손쉽게 찾아보세요',
    },
  ];

  const handleNext = () => {
    // flatListRef가 null이 아닐 때만 scrollToIndex를 호출합니다.
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({index: currentIndex + 1});
    }
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = Math.ceil(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(scrollPosition);
  };

  const renderItem = ({item}: {item: Slide}) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ref={flatListRef}
      />
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={
              currentIndex === index ? styles.activeDot : styles.inactiveDot
            }
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  slide: {
    width,
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#333',
    marginHorizontal: 5,
  },
  inactiveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: '#333',
    padding: 15,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Onboarding;
